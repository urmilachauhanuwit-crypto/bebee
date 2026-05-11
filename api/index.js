export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const targetDomain = "talents.studysmarter.co.uk";
  const proxyHost = new URL(req.url).host;
  const requestURL = new URL(req.url);
  const targetURL = `https://${targetDomain}${requestURL.pathname}${requestURL.search}`;

  const HOP_BY_HOP = [
    "connection", "keep-alive", "proxy-authenticate",
    "proxy-authorization", "te", "trailers",
    "transfer-encoding", "upgrade", "cookie",
  ];

  // Clean headers
  const cleanHeaders = {};
  for (const [key, value] of req.headers.entries()) {
    if (!HOP_BY_HOP.includes(key.toLowerCase())) {
      cleanHeaders[key] = value;
    }
  }

  const upstreamHeaders = {
    ...cleanHeaders,
    host: targetDomain,
    "x-forwarded-host": proxyHost,
    "x-forwarded-proto": "https",
  };

  const rewrite = (text) =>
    text
      .split(`https://${targetDomain}`).join(`https://${proxyHost}`)
      .split(`http://${targetDomain}`).join(`https://${proxyHost}`);

  try {
    let fetchURL = targetURL;
    let response;
    let redirectCount = 0;

    while (redirectCount < 5) {
      response = await fetch(fetchURL, {
        method: req.method,
        headers: upstreamHeaders,
        body: req.method !== "GET" && req.method !== "HEAD" ? req.body : undefined,
        redirect: "manual",
      });

      if (response.status >= 300 && response.status < 400) {
        let location = response.headers.get("location") || "";

        // Geo-redirect to another studysmarter domain — force back to .co.uk
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
        fetchURL = location.startsWith("http")
          ? location
          : `https://${targetDomain}${location}`;
        redirectCount++;
        continue;
      }

      break;
    }

    if (!response || redirectCount >= 5) {
      return new Response("Too many upstream redirects", { status: 502 });
    }

    const SKIP_RESPONSE_HEADERS = [
      "content-encoding", "transfer-encoding", "content-length", "connection",
    ];

    const responseHeaders = new Headers();
    for (const [key, value] of response.headers.entries()) {
      if (SKIP_RESPONSE_HEADERS.includes(key.toLowerCase())) continue;
      if (key.toLowerCase() === "set-cookie") {
        responseHeaders.set(key, value.replace(/Domain=[^;]+;?\s*/gi, ""));
        continue;
      }
      responseHeaders.set(key, value);
    }

    const contentType = response.headers.get("content-type") || "";

    // HTML
    if (contentType.includes("text/html")) {
      let body = rewrite(await response.text());

      // Inject Google Search Console verification
      body = body.replace(
        "<head>",
        `<head>\n<meta name="google-site-verification" content="oOB4GFrNSNdykfLPFYsy8byFMtrbAiccGJfrX7_UcOU" />`
      );

      // Update JobPosting schema dates
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

      responseHeaders.set("content-type", "text/html; charset=utf-8");
      return new Response(body, { status: response.status, headers: responseHeaders });
    }

    // CSS
    if (contentType.includes("text/css")) {
      responseHeaders.set("content-type", "text/css");
      return new Response(rewrite(await response.text()), { status: response.status, headers: responseHeaders });
    }

    // Sitemap / XML
    if (requestURL.pathname.includes("sitemap") || contentType.includes("xml")) {
      responseHeaders.set("content-type", "application/xml; charset=utf-8");
      return new Response(rewrite(await response.text()), { status: response.status, headers: responseHeaders });
    }

    // JavaScript
    if (contentType.includes("javascript")) {
      responseHeaders.set("content-type", contentType);
      return new Response(rewrite(await response.text()), { status: response.status, headers: responseHeaders });
    }

    // Binary passthrough
    return new Response(response.body, { status: response.status, headers: responseHeaders });

  } catch (error) {
    return new Response("Proxy error: " + error.message, { status: 500 });
  }
}
