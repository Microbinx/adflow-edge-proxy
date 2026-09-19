// ======================================================================
// UNIVERSAL AD VERIFICATION & BOT CONTROL INTERCEPTOR 
// DOMAIN: microbim.name.ng
// ======================================================================

// 📋 Active Ad Network Ads.txt lines for immediate network verification
const ADS_TXT_LINES = [
  "google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0",
  "adsterra.com, 182921, DIRECT, f7343198008ae3eedc1ddfaccd05a684"
];

// 🤖 Universal robots.txt configuration with sensitive custom PHP file protection
const ROBOTS_TXT_CONTENT = `User-agent: *
Allow: /

# 🚫 BLOCK ALL BOTS FROM SENSITIVE PATHS & ADMIN FILES
Disallow: /adflow/
Disallow: /site-uptimizer.php
Disallow: /site-injector.php
Disallow: /config.php


# ✅ FULL PATH FOR BOT ACCESSIBILITY
Sitemap: https://microbim.name.ng/sitemap.php`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.toLowerCase();

    // 🛡️ INTERCEPT A: Serve ads.txt directly from Cloudflare Edge (Bypasses Host Firewall)
    if (path === '/ads.txt') {
      return new Response(ADS_TXT_LINES.join('\n'), {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=86400", // Cache for 24 hours
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // 🤖 INTERCEPT B: Serve robots.txt directly from the edge to universal crawlers
    if (path === '/robots.txt') {
      return new Response(ROBOTS_TXT_CONTENT, {
        status: 200,
        headers: { 
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=86400"
        }
      });
    }

    // 🛑 FALLBACK: Safety response if traffic outside of assigned paths hits the Worker
    // Note: If you are using Cloudflare DNS standard A records for your homepage, 
    // human visitors will never hit this 404 response.
    return new Response("Not Found", { status: 404 });
  }
};
