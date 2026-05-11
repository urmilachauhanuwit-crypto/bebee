module.exports = async (req, res) => {
  const targetDomain = "dailyremote.com";
  const proxyHost = req.headers.host;

  const HOP_BY_HOP = [
    "connection", "keep-alive", "proxy-authenticate",
    "proxy-authorization", "te", "trailers",
    "transfer-encoding", "upgrade",
  ];

  // Strip hop-by-hop and cookies to avoid session/geo issues
  const STRIP_HEADERS = [...HOP_BY_HOP, "cookie"];

  const cleanHeaders = Object.fromEntries(
    Object.entries(req.headers).filter(([k]) => !STRIP_HEADERS.includes(k.toLowerCase()))
  );

  let bodyBuffer = null;
  if (req.method !== "GET" && req.method !== "HEAD") {
    bodyBuffer = await new Promise((resolve, reject) => {
      const chunks = [];
      req.on("data", (chunk) => chunks.push(chunk));
      req.on("end", () => resolve(Buffer.concat(chunks)));
      req.on("error", reject);
    });
  }

  const upstreamHeaders = {
    ...cleanHeaders,
    host: targetDomain,
    "x-forwarded-host": proxyHost,
    "x-forwarded-proto": "https",
  };

  try {
    let fetchURL = `https://${targetDomain}${req.url}`;
    let response;
    let redirectCount = 0;

    while (redirectCount < 5) {
      response = await fetch(fetchURL, {
        method: req.method,
        headers: upstreamHeaders,
        body: bodyBuffer || undefined,
        redirect: "manual",
      });

      if (response.status >= 300 && response.status < 400) {
        let location = response.headers.get("location") || "";

        // Follow redirect server-side
        fetchURL = location.startsWith("http")
          ? location
          : `https://${targetDomain}${location}`;

        redirectCount++;
        continue;
      }

      break;
    }

    if (!response || redirectCount >= 5) {
      return res.status(502).send("Too many upstream redirects");
    }

    // Copy safe response headers
    const SKIP_RESPONSE_HEADERS = [
      "content-encoding", "transfer-encoding", "content-length", "connection",
    ];

    for (const [key, value] of response.headers.entries()) {
      if (SKIP_RESPONSE_HEADERS.includes(key.toLowerCase())) continue;
      if (key.toLowerCase() === "set-cookie") {
        res.setHeader(key, value.replace(/Domain=[^;]+;?\s*/gi, ""));
        continue;
      }
      res.setHeader(key, value);
    }

    const contentType = response.headers.get("content-type") || "";

    const rewrite = (text) =>
      text
        .split(`https://${targetDomain}`).join(`https://${proxyHost}`)
        .split(`http://${targetDomain}`).join(`https://${proxyHost}`);

    // HTML
    if (contentType.includes("text/html")) {
      let body = rewrite(await response.text());

      // Update JobPosting schema dates for SEO
      body = body.replace(
        /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
        (match, json) => {
          try {
            const schema = JSON.parse(json);
            const update = (obj) => {
              if (!obj || typeof obj !== "object") return obj;
              if (Array.isArray(obj)) return obj.map(update);
              if (obj["@type"] === "JobPosting") {
                obj["datePosted"] = "2026-05-06";
                obj["validThrough"] = "2026-12-31";
              }
              Object.keys(obj).forEach((k) => { obj[k] = update(obj[k]); });
              return obj;
            };
            return `<script type="application/ld+json">${JSON.stringify(update(schema))}</script>`;
          } catch {
            return match;
          }
        }
      );

      res.setHeader("content-type", "text/html; charset=utf-8");
      return res.status(response.status).send(body);
    }

    // CSS
    if (contentType.includes("text/css")) {
      res.setHeader("content-type", "text/css");
      return res.status(response.status).send(rewrite(await response.text()));
    }

    // Sitemap / XML
    if (req.url.includes("sitemap") || contentType.includes("xml")) {
      res.setHeader("content-type", "application/xml; charset=utf-8");
      return res.status(response.status).send(rewrite(await response.text()));
    }

    // JavaScript
    if (contentType.includes("javascript")) {
      res.setHeader("content-type", contentType);
      return res.status(response.status).send(rewrite(await response.text()));
    }

    // Binary passthrough (images, fonts, etc.)
    const buffer = await response.arrayBuffer();
    return res.status(response.status).send(Buffer.from(buffer));

  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).send("Proxy error: " + error.message);
  }
};
