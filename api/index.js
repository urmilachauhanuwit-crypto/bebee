export const config = {
  runtime: "edge",
};

const CUSTOM_HOME = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Unique Hire — Find Your Next Role</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --green: #00e676;
      --green-mid: #00c853;
      --green-dark: #007a33;
      --bg: #080f0a;
      --bg2: #0d160f;
      --bg3: #111a13;
      --surface: #152018;
      --border: #1e3022;
      --text: #e8f5e9;
      --muted: #6a8f70;
      --white: #ffffff;
    }

    html { scroll-behavior: smooth; }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: 'DM Sans', sans-serif;
      font-weight: 300;
      overflow-x: hidden;
      cursor: none;
    }

    /* Custom cursor */
    .cursor {
      width: 10px; height: 10px;
      background: var(--green);
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 9999;
      transition: transform 0.15s ease;
      mix-blend-mode: screen;
    }
    .cursor-ring {
      width: 36px; height: 36px;
      border: 1px solid var(--green);
      border-radius: 50%;
      position: fixed;
      pointer-events: none;
      z-index: 9998;
      transition: all 0.08s ease;
      opacity: 0.5;
    }

    /* Noise overlay */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
      pointer-events: none;
      z-index: 1;
      opacity: 0.4;
    }

    /* ── HEADER ── */
    header {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      padding: 0 48px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border);
      background: rgba(8,15,10,0.85);
      backdrop-filter: blur(16px);
    }

    .logo {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 1.4rem;
      letter-spacing: -0.03em;
      color: var(--white);
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-dot {
      width: 8px; height: 8px;
      background: var(--green);
      border-radius: 50%;
      display: inline-block;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.5); opacity: 0.6; }
    }

    nav {
      display: flex;
      align-items: center;
      gap: 36px;
    }
    nav a {
      color: var(--muted);
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 400;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      transition: color 0.2s;
    }
    nav a:hover { color: var(--green); }

    .btn-nav {
      background: var(--green);
      color: var(--bg) !important;
      padding: 10px 24px;
      border-radius: 2px;
      font-weight: 500 !important;
      font-size: 0.8rem !important;
      letter-spacing: 0.08em !important;
      transition: background 0.2s, transform 0.2s !important;
    }
    .btn-nav:hover {
      background: var(--green-mid) !important;
      color: var(--bg) !important;
      transform: translateY(-1px);
    }

    /* ── HERO ── */
    .hero {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 120px 48px 80px;
      position: relative;
      overflow: hidden;
    }

    /* Animated grid bg */
    .hero-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(var(--border) 1px, transparent 1px),
        linear-gradient(90deg, var(--border) 1px, transparent 1px);
      background-size: 60px 60px;
      opacity: 0.4;
      mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent);
    }

    /* Green glow blobs */
    .blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      pointer-events: none;
    }
    .blob-1 {
      width: 600px; height: 600px;
      background: radial-gradient(circle, rgba(0,230,118,0.12) 0%, transparent 70%);
      top: -100px; right: -100px;
      animation: float1 8s ease-in-out infinite;
    }
    .blob-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(0,200,83,0.08) 0%, transparent 70%);
      bottom: 100px; left: -50px;
      animation: float2 10s ease-in-out infinite;
    }
    @keyframes float1 {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(-30px, 30px); }
    }
    @keyframes float2 {
      0%, 100% { transform: translate(0, 0); }
      50% { transform: translate(20px, -20px); }
    }

    .hero-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 6px 16px;
      border-radius: 100px;
      font-size: 0.75rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--green);
      margin-bottom: 40px;
      width: fit-content;
      animation: fadeUp 0.8s ease both;
    }
    .hero-tag span { width: 6px; height: 6px; background: var(--green); border-radius: 50%; }

    .hero-title {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: clamp(3.5rem, 8vw, 8rem);
      line-height: 0.95;
      letter-spacing: -0.04em;
      color: var(--white);
      max-width: 900px;
      animation: fadeUp 0.8s 0.1s ease both;
    }
    .hero-title em {
      font-style: normal;
      color: var(--green);
      position: relative;
    }
    .hero-title em::after {
      content: '';
      position: absolute;
      bottom: 4px; left: 0; right: 0;
      height: 3px;
      background: var(--green);
      opacity: 0.3;
    }

    .hero-sub {
      margin-top: 32px;
      font-size: 1.1rem;
      color: var(--muted);
      max-width: 480px;
      line-height: 1.7;
      animation: fadeUp 0.8s 0.2s ease both;
    }

    .hero-actions {
      margin-top: 52px;
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
      animation: fadeUp 0.8s 0.3s ease both;
    }

    .btn-primary {
      background: var(--green);
      color: var(--bg);
      padding: 18px 40px;
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      text-decoration: none;
      border-radius: 2px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      transition: all 0.25s;
      position: relative;
      overflow: hidden;
    }
    .btn-primary::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--white);
      opacity: 0;
      transition: opacity 0.2s;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(0,230,118,0.25); }
    .btn-primary:hover::before { opacity: 0.08; }

    .btn-ghost {
      color: var(--text);
      padding: 18px 32px;
      font-size: 0.9rem;
      letter-spacing: 0.03em;
      text-decoration: none;
      border: 1px solid var(--border);
      border-radius: 2px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      transition: all 0.25s;
    }
    .btn-ghost:hover { border-color: var(--green); color: var(--green); }

    .hero-stats {
      margin-top: 80px;
      display: flex;
      gap: 60px;
      padding-top: 48px;
      border-top: 1px solid var(--border);
      animation: fadeUp 0.8s 0.4s ease both;
    }
    .stat-num {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 2.2rem;
      color: var(--white);
      letter-spacing: -0.03em;
    }
    .stat-num span { color: var(--green); }
    .stat-label {
      font-size: 0.8rem;
      color: var(--muted);
      letter-spacing: 0.05em;
      text-transform: uppercase;
      margin-top: 4px;
    }

    /* ── MARQUEE ── */
    .marquee-wrap {
      overflow: hidden;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      padding: 18px 0;
      background: var(--bg2);
    }
    .marquee-track {
      display: flex;
      gap: 0;
      animation: marquee 25s linear infinite;
      width: max-content;
    }
    .marquee-item {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 0 40px;
      font-family: 'Syne', sans-serif;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--muted);
      white-space: nowrap;
    }
    .marquee-item::after {
      content: '✦';
      color: var(--green);
      font-size: 0.6rem;
    }
    @keyframes marquee {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }

    /* ── HOW IT WORKS ── */
    .section {
      padding: 120px 48px;
      position: relative;
    }

    .section-label {
      font-size: 0.7rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--green);
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .section-label::before {
      content: '';
      width: 30px; height: 1px;
      background: var(--green);
    }

    .section-title {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: clamp(2rem, 4vw, 3.5rem);
      letter-spacing: -0.03em;
      color: var(--white);
      line-height: 1.05;
      max-width: 600px;
    }

    .steps {
      margin-top: 80px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 2px;
    }
    .step {
      background: var(--bg2);
      border: 1px solid var(--border);
      padding: 48px 40px;
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s, transform 0.3s;
    }
    .step:hover {
      border-color: var(--green-dark);
      transform: translateY(-4px);
    }
    .step::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: var(--green);
      transform: scaleX(0);
      transition: transform 0.3s;
      transform-origin: left;
    }
    .step:hover::before { transform: scaleX(1); }

    .step-num {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 4rem;
      color: var(--border);
      line-height: 1;
      margin-bottom: 32px;
      letter-spacing: -0.05em;
    }
    .step-icon {
      width: 48px; height: 48px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      margin-bottom: 24px;
    }
    .step h3 {
      font-family: 'Syne', sans-serif;
      font-weight: 700;
      font-size: 1.2rem;
      color: var(--white);
      margin-bottom: 12px;
    }
    .step p {
      color: var(--muted);
      font-size: 0.9rem;
      line-height: 1.7;
    }

    /* ── CATEGORIES ── */
    .categories-section {
      padding: 0 48px 120px;
    }
    .categories-grid {
      margin-top: 64px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }
    .cat-card {
      background: var(--bg2);
      border: 1px solid var(--border);
      padding: 28px 24px;
      border-radius: 4px;
      text-decoration: none;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: all 0.25s;
      cursor: pointer;
    }
    .cat-card:hover {
      border-color: var(--green-dark);
      background: var(--surface);
      transform: translateY(-3px);
    }
    .cat-icon { font-size: 1.6rem; }
    .cat-name {
      font-family: 'Syne', sans-serif;
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--white);
    }
    .cat-count {
      font-size: 0.75rem;
      color: var(--muted);
    }

    /* ── CTA BAND ── */
    .cta-band {
      margin: 0 48px 120px;
      background: var(--surface);
      border: 1px solid var(--green-dark);
      padding: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 40px;
      position: relative;
      overflow: hidden;
      flex-wrap: wrap;
    }
    .cta-band::before {
      content: '';
      position: absolute;
      top: -80px; right: -80px;
      width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(0,230,118,0.12) 0%, transparent 70%);
      filter: blur(40px);
    }
    .cta-band h2 {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: clamp(1.8rem, 3vw, 2.8rem);
      letter-spacing: -0.03em;
      color: var(--white);
      max-width: 480px;
      line-height: 1.1;
    }
    .cta-band h2 span { color: var(--green); }

    /* ── FOOTER ── */
    footer {
      border-top: 1px solid var(--border);
      padding: 60px 48px 40px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 32px;
    }
    .footer-logo {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      font-size: 1.2rem;
      color: var(--white);
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }
    .footer-links {
      display: flex;
      gap: 32px;
      flex-wrap: wrap;
    }
    .footer-links a {
      color: var(--muted);
      text-decoration: none;
      font-size: 0.85rem;
      transition: color 0.2s;
    }
    .footer-links a:hover { color: var(--green); }
    .footer-copy {
      color: var(--muted);
      font-size: 0.75rem;
      width: 100%;
      padding-top: 32px;
      border-top: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      header { padding: 0 24px; }
      nav { gap: 16px; }
      nav a:not(.btn-nav) { display: none; }
      .hero { padding: 100px 24px 60px; }
      .hero-stats { gap: 32px; flex-wrap: wrap; }
      .section, .categories-section { padding: 80px 24px; }
      .cta-band { padding: 48px 32px; margin: 0 24px 80px; }
      footer { padding: 48px 24px 32px; }
    }
  </style>
</head>
<body>

  <div class="cursor" id="cursor"></div>
  <div class="cursor-ring" id="cursorRing"></div>

  <!-- HEADER -->
  <header>
    <a href="/" class="logo">
      <span class="logo-dot"></span>
      Unique Hire
    </a>
    <nav>
      <a href="/jobs/">Browse Jobs</a>
      <a href="/careers-advice/">Career Advice</a>
      <a href="/advertiser/vacancies/vacancy/" class="btn-nav">Post a Job</a>
    </nav>
  </header>

  <!-- HERO -->
  <section class="hero">
    <div class="hero-grid"></div>
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>

    <div class="hero-tag"><span></span> Now hiring in Stevenage & beyond</div>

    <h1 class="hero-title">
      Find work<br/>that feels<br/><em>uniquely</em> yours.
    </h1>

    <p class="hero-sub">
      Unique Hire connects ambitious people with the roles they were made for. Real jobs. Real people. No noise.
    </p>

    <div class="hero-actions">
      <a href="/jobs/" class="btn-primary">
        Browse All Jobs
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
      <a href="/careers-advice/" class="btn-ghost">Career Advice</a>
    </div>

    <div class="hero-stats">
      <div>
        <div class="stat-num">10<span>k+</span></div>
        <div class="stat-label">Active Listings</div>
      </div>
      <div>
        <div class="stat-num">2<span>k+</span></div>
        <div class="stat-label">Companies Hiring</div>
      </div>
      <div>
        <div class="stat-num">98<span>%</span></div>
        <div class="stat-label">Placement Rate</div>
      </div>
    </div>
  </section>

  <!-- MARQUEE -->
  <div class="marquee-wrap">
    <div class="marquee-track">
      ${["Engineering", "Marketing", "Finance", "Healthcare", "Design", "Technology", "Logistics", "Education", "Sales", "Hospitality", "Legal", "Administration", "Engineering", "Marketing", "Finance", "Healthcare", "Design", "Technology", "Logistics", "Education", "Sales", "Hospitality", "Legal", "Administration"].map(t => `<div class="marquee-item">${t}</div>`).join('')}
    </div>
  </div>

  <!-- HOW IT WORKS -->
  <section class="section">
    <div class="section-label">How it works</div>
    <h2 class="section-title">Three steps to your next role</h2>
    <div class="steps">
      <div class="step">
        <div class="step-num">01</div>
        <div class="step-icon">🔍</div>
        <h3>Search & Filter</h3>
        <p>Browse thousands of verified listings by location, industry, and salary. No fake jobs, no clutter.</p>
      </div>
      <div class="step">
        <div class="step-num">02</div>
        <div class="step-icon">📄</div>
        <h3>Apply Instantly</h3>
        <p>One-click applications directly to employers. Your profile does the heavy lifting for you.</p>
      </div>
      <div class="step">
        <div class="step-num">03</div>
        <div class="step-icon">🎯</div>
        <h3>Get Hired</h3>
        <p>Connect with hiring managers directly. No middlemen, no delays. Just results.</p>
      </div>
      <div class="step">
        <div class="step-num">04</div>
        <div class="step-icon">🚀</div>
        <h3>Grow Your Career</h3>
        <p>Access career advice, salary insights, and skills tools to keep levelling up.</p>
      </div>
    </div>
  </section>

  <!-- CATEGORIES -->
  <div class="categories-section">
    <div class="section-label">Explore roles</div>
    <h2 class="section-title">Browse by category</h2>
    <div class="categories-grid">
      ${[
        ["💻","Technology","1,240 jobs"],
        ["🏥","Healthcare","890 jobs"],
        ["📊","Finance","670 jobs"],
        ["🎨","Creative","430 jobs"],
        ["🏗️","Engineering","810 jobs"],
        ["📦","Logistics","560 jobs"],
        ["🎓","Education","390 jobs"],
        ["🛎️","Hospitality","720 jobs"],
        ["⚖️","Legal","210 jobs"],
        ["📣","Marketing","540 jobs"],
        ["🏢","Admin","480 jobs"],
        ["🤝","Sales","650 jobs"],
      ].map(([icon, name, count]) => `
        <a class="cat-card" href="/jobs/?q=${encodeURIComponent(name)}">
          <div class="cat-icon">${icon}</div>
          <div class="cat-name">${name}</div>
          <div class="cat-count">${count}</div>
        </a>`).join('')}
    </div>
  </div>

  <!-- CTA BAND -->
  <div class="cta-band">
    <h2>Ready to find your <span>next chapter?</span></h2>
    <a href="/jobs/" class="btn-primary">
      Start Searching
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </a>
  </div>

  <!-- FOOTER -->
  <footer>
    <a href="/" class="footer-logo">
      <span style="width:7px;height:7px;background:var(--green);border-radius:50%;display:inline-block"></span>
      Unique Hire
    </a>
    <div class="footer-links">
      <a href="/jobs/">Jobs</a>
      <a href="/careers-advice/">Career Advice</a>
      <a href="/advertiser/vacancies/vacancy/">Post a Job</a>
    </div>
    <div class="footer-copy">
      <span>© 2026 Unique Hire. All rights reserved.</span>
      <span>Powered by passion, not algorithms.</span>
    </div>
  </footer>

  <script>
    // Custom cursor
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    function animateCursor() {
      cursor.style.left = (mx - 5) + 'px';
      cursor.style.top = (my - 5) + 'px';
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = (rx - 18) + 'px';
      ring.style.top = (ry - 18) + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', () => cursor.style.transform = 'scale(3)');
      el.addEventListener('mouseleave', () => cursor.style.transform = 'scale(1)');
    });

    // Scroll-reveal
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.step, .cat-card').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease, border-color 0.3s';
      observer.observe(el);
    });
  </script>
</body>
</html>`;

export default async function handler(req) {
  const targetDomain = "jobs.stevenagefc.com";
  const proxyHost = new URL(req.url).host;
  const requestURL = new URL(req.url);

  // Serve custom homepage for root only
  if (requestURL.pathname === "/" || requestURL.pathname === "") {
    return new Response(CUSTOM_HOME, {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }

  const STRIP_HEADERS = [
    "connection", "keep-alive", "proxy-authenticate",
    "proxy-authorization", "te", "trailers",
    "transfer-encoding", "upgrade",
    "cookie",
    "x-forwarded-for",
    "x-real-ip",
    "cf-connecting-ip",
    "cf-ipcountry",
    "true-client-ip",
  ];

  const cleanHeaders = {};
  for (const [key, value] of req.headers.entries()) {
    if (!STRIP_HEADERS.includes(key.toLowerCase())) {
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

  // Inject custom header into proxied HTML pages
  const injectHeader = (html) => {
    const headerHTML = \`
    <style>
      #uh-header {
        position: fixed; top: 0; left: 0; right: 0; z-index: 99999;
        height: 64px; padding: 0 40px;
        display: flex; align-items: center; justify-content: space-between;
        background: rgba(8,15,10,0.95);
        backdrop-filter: blur(16px);
        border-bottom: 1px solid #1e3022;
        font-family: 'DM Sans', sans-serif;
      }
      #uh-header a.uh-logo {
        font-family: 'Syne', sans-serif; font-weight: 800;
        font-size: 1.2rem; color: #fff; text-decoration: none;
        display: flex; align-items: center; gap: 8px;
        letter-spacing: -0.03em;
      }
      #uh-header .uh-dot {
        width: 7px; height: 7px; background: #00e676;
        border-radius: 50%; display: inline-block;
        animation: uhpulse 2s infinite;
      }
      @keyframes uhpulse {
        0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0.6}
      }
      #uh-header nav { display: flex; gap: 28px; align-items: center; }
      #uh-header nav a {
        color: #6a8f70; text-decoration: none; font-size: 0.82rem;
        letter-spacing: 0.05em; text-transform: uppercase;
        transition: color 0.2s;
      }
      #uh-header nav a:hover { color: #00e676; }
      #uh-header .uh-btn {
        background: #00e676 !important; color: #080f0a !important;
        padding: 9px 22px; border-radius: 2px; font-weight: 600 !important;
      }
      #uh-header .uh-btn:hover { background: #00c853 !important; }
      body { padding-top: 64px !important; }
      @media(max-width:600px){
        #uh-header nav a:not(.uh-btn){display:none}
        #uh-header{padding:0 20px}
      }
    </style>
    <link href="https://fonts.googleapis.com/css2?family=Syne:wght@800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
    <div id="uh-header">
      <a href="/" class="uh-logo"><span class="uh-dot"></span>Unique Hire</a>
      <nav>
        <a href="/jobs/">Browse Jobs</a>
        <a href="/careers-advice/">Career Advice</a>
        <a href="/advertiser/vacancies/vacancy/" class="uh-btn">Post a Job</a>
      </nav>
    </div>\`;
    return html.replace(/<body[^>]*>/i, (match) => match + headerHTML);
  };

  try {
    let fetchURL = \`https://\${targetDomain}\${requestURL.pathname}\${requestURL.search}\`;
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
        fetchURL = location.startsWith("http") ? location : \`https://\${targetDomain}\${location}\`;
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

    if (contentType.includes("text/html")) {
      let body = rewrite(await response.text());
      body = injectHeader(body);
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
            return \`<script type="application/ld+json">\${JSON.stringify(update(schema))}</script>\`;
          } catch { return match; }
        }
      );
      responseHeaders.set("content-type", "text/html; charset=utf-8");
      return new Response(body, { status: response.status, headers: responseHeaders });
    }

    if (contentType.includes("text/css")) {
      responseHeaders.set("content-type", "text/css");
      return new Response(rewrite(await response.text()), { status: response.status, headers: responseHeaders });
    }

    if (requestURL.pathname.includes("sitemap") || contentType.includes("xml")) {
      responseHeaders.set("content-type", "application/xml; charset=utf-8");
      return new Response(rewrite(await response.text()), { status: response.status, headers: responseHeaders });
    }

    if (contentType.includes("javascript")) {
      responseHeaders.set("content-type", contentType);
      return new Response(rewrite(await response.text()), { status: response.status, headers: responseHeaders });
    }

    return new Response(response.body, { status: response.status, headers: responseHeaders });

  } catch (error) {
    return new Response("Proxy error: " + error.message, { status: 500 });
  }
}
