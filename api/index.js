module.exports = async (req, res) => {
  const targetDomain = "talents.studysmarter.co.uk";
  const proxyHost = req.headers.host;

  const HOP_BY_HOP = [
    "connection", "keep-alive", "proxy-authenticate",
    "proxy-authorization", "te", "trailers",
    "transfer-encoding", "upgrade",
  ];

  const cleanHeaders = Object.fromEntries(
    Object.entries(req.headers).filter(([k]) => !HOP_BY_HOP.includes(k.toLowerCase()))
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
    "x-forwarded-for": "2.125.160.216",
    "x-real-ip": "2.125.160.216",
    "cf-ipcountry": "GB",
    "accept-language": "en-GB,en;q=0.9",
  };

  try {
    let fetchURL = `https://${targetDomain}${req.url}`;
    let response;
    let redirectCount = 0;

    // Follow ALL redirects server-side — never let a redirect reach the client browser
    while (redirectCount < 10) {
      response = await fetch(fetchURL, {
        method: req.method,
        headers: upstreamHeaders,
        body: bodyBuffer || undefined,
        redirect: "manual",
      });

      if (response.status >= 300 && response.status < 400) {
        let location = response.headers.get("location") || "";

        // Geo-redirect to .de/.eu/.com — strip domain, keep path, re-fetch on .co.uk
        if (
          location.includes("studysmarter.de") ||
          location.includes("studysmarter.eu") ||
          (location.includes("studysmarter.com") && !location.includes(".co.uk"))
        ) {
          try {
            const u = new URL(location);
            fetchURL = `https://${targetDomain}${u.pathname}${u.search}`;
          } catch {
            fetchURL = `https://${targetDomain}/`;
          }
          redirectCount++;
          continue;
        }

        // Normal redirect — follow server-side
        if (location.startsWith("http")) {
          fetchURL = location;
        } else {
          fetchURL = `https://${targetDomain}${location}`;
        }

        redirectCount++;
        continue;
      }

      break; // Got a real response
    }

    if (!response || redirectCount >= 10) {
      return res.status(502).send("Too many upstream redirects");
    }

    // Copy safe response headers to client
    const SKIP_HEADERS = [
      "content-encoding", "transfer-encoding",
      "content-length", "connection",
    ];

    for (const [key, value] of response.headers.entries()) {
      if (SKIP_HEADERS.includes(key.toLowerCase())) continue;
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

      body = body.replace(
        "<head>",
        `<head>\n<meta name="google-site-verification" content="oOB4GFrNSNdykfLPFYsy8byFMtrbAiccGJfrX7_UcOU" />`
      );

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

    // Binary passthrough
    const buffer = await response.arrayBuffer();
    return res.status(response.status).send(Buffer.from(buffer));

  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).send("Proxy error: " + error.message);
  }
};
