module.exports = async (req, res) => {
  const shopifyDomain = "talents.studysmarter.co.uk"; // keep this, just rename mentally
  const proxyHost = req.headers.host;
  const targetURL = `https://${shopifyDomain}${req.url}`;

  try {
    let bodyBuffer = null;
    if (req.method !== "GET" && req.method !== "HEAD") {
      bodyBuffer = await new Promise((resolve, reject) => {
        const chunks = [];
        req.on("data", (chunk) => chunks.push(chunk));
        req.on("end", () => resolve(Buffer.concat(chunks)));
        req.on("error", reject);
      });
    }

    let fetchURL = targetURL;
    let response;
    let redirectCount = 0;

    while (redirectCount < 5) {
      response = await fetch(fetchURL, {
        method: req.method,
        headers: {
          ...req.headers,
          host: "talents.studysmarter.co.uk",
          "X-Forwarded-Host": proxyHost,
          "X-Forwarded-Proto": "https",
          // ✅ Spoof UK origin to prevent geo-redirect to .de
          "X-Forwarded-For": "2.125.160.216",
          "X-Real-IP": "2.125.160.216",
          "CF-IPCountry": "GB",
          "Accept-Language": "en-GB,en;q=0.9",
        },
        body: bodyBuffer || null,
        redirect: "manual",
      });

      if (response.status >= 300 && response.status < 400) {
        let location = response.headers.get("location") || "";

        // ✅ Block redirect to .de or any other geo variant
        if (
          location.includes("studysmarter.de") ||
          location.includes("studysmarter.eu") ||
          location.includes("studysmarter.com")
        ) {
          // Force re-fetch the original .co.uk URL, ignore the geo redirect
          fetchURL = `https://talents.studysmarter.co.uk${req.url}`;
          redirectCount++;
          continue;
        }

        if (location.includes("talents.studysmarter.co.uk")) {
          location = location
            .replace(`https://talents.studysmarter.co.uk`, `https://${proxyHost}`)
            .replace(`http://talents.studysmarter.co.uk`, `https://${proxyHost}`);
          res.setHeader("location", location);
          return res.status(response.status).end();
        }

        if (location.includes(proxyHost)) {
          res.setHeader("location", location);
          return res.status(response.status).end();
        }

        fetchURL = location.startsWith("http")
          ? location
          : `https://talents.studysmarter.co.uk${location}`;
        redirectCount++;
        continue;
      }

      break;
    }

    // ... rest of your code stays exactly the same
