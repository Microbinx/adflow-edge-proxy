// ======================================================================
// MULTI-ROUTE INTERCEPT ENGINE (STABLE EDGE ROUTER)
// DOMAIN: microbim.name.ng
// ======================================================================

// 🟢 ADD YOUR ACTUAL ZONE / PUBLISHER IDs IN THIS CONTENT BLOCK:
const ADS_TXT_CONTENT = `# Adsterra
adsterra.com, YOUR_ADSTERRA_PUB_ID, DIRECT, f08c47fec0942fa0

# Adcash
adcash.com, YOUR_ADCASH_PUB_ID, DIRECT, 4f2c00d43a539e1a

# HilltopAds
hilltopads.com, YOUR_HILLTOPADS_PUB_ID, DIRECT, a1b2c3d4e5f6a7b8


# Cybertron
cybertron.com, 29, DIRECT, 2892,

# Cybertron
cybertron.com, 31, DIRECT, 2893`;

const ROBOTS_TXT_CONTENT = `User-agent: *
Allow: /

Disallow: /adflow/
Disallow: /sessions/
Disallow: /config.php
Disallow: /adflow-injector.php
Disallow: /site-optimizer.php

Sitemap: https://microbim.name.ng/sitemap.xml`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.toLowerCase();

    // 🛡️ 1. Serve ads.txt directly from Cloudflare Edge
    if (path === '/ads.txt') {
      return new Response(ADS_TXT_CONTENT, {
        status: 200,
        headers: { 
          "Content-Type": "text/plain; charset=utf-8", 
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=3600"
        }
      });
    }

    // 🤖 2. Serve robots.txt directly from the edge
    if (path === '/robots.txt') {
      return new Response(ROBOTS_TXT_CONTENT, {
        status: 200,
        headers: { 
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=86400"
        }
      });
    }

    // 🗺️ 3. EDGE XML SITEMAP COMPILER (Valid Schema Standard)
    if (path === '/sitemap.xml') {
      // 📝 OPTIONAL: If you have dynamic blog URL categories or posts, 
      // you can hardcode them here to make sure bots read them safely.
      const blogUrlsXml = `
  <url><loc>https://microbim.name.ng</loc><changefreq>monthly</changefreq><priority>0.65</priority></url>
  <url><loc>https://microbim.name.ng</loc><changefreq>monthly</changefreq><priority>0.65</priority></url>
      `;

      const completeXmlSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://sitemaps.org">
  <url><loc>https://microbim.name.ng</loc><changefreq>daily</changefreq><priority>1.00</priority></url>
  <url><loc>https://microbim.name.ng/about</loc><changefreq>monthly</changefreq><priority>0.80</priority></url>
  <url><loc>https://microbim.name.ng/contact</loc><changefreq>monthly</changefreq><priority>0.80</priority></url>
  <url><loc>https://microbim.name.ng/blog</loc><changefreq>weekly</changefreq><priority>0.80</priority></url>
  <url><loc>https://microbim.name.ng/website</loc><changefreq>monthly</changefreq><priority>0.70</priority></url>
  <url><loc>https://microbim.name.ng/mobileapp</loc><changefreq>monthly</changefreq><priority>0.70</priority></url>
  <url><loc>https://microbim.name.ng/solutions</loc><changefreq>monthly</changefreq><priority>0.70</priority></url>
  <url><loc>https://microbim.name.ng/academy</loc><changefreq>weekly</changefreq><priority>0.70</priority></url>
  <url><loc>https://microbim.name.ng/store</loc><changefreq>weekly</changefreq><priority>0.75</priority></url>
  <url><loc>https://microbim.name.ng/download</loc><changefreq>weekly</changefreq><priority>0.75</priority></url>
  <url><loc>https://microbim.name.ng/privacy</loc><changefreq>yearly</changefreq><priority>0.50</priority></url>
${blogUrlsXml}</urlset>`;

      return new Response(completeXmlSitemap.trim(), {
        status: 200,
        headers: { 
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=86400"
        }
      });
    }

    // 🔄 4. Pass all regular website traffic directly through to InfinityFree
    return fetch(request);
  }
};
