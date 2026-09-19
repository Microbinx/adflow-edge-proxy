// ======================================================================
// MULTI-ROUTE INTERCEPT ENGINE (WITH EDGE SITEMAP PARSER)
// DOMAIN: microbim.name.ng
// ======================================================================

const ADS_TXT_LINES = [
  "google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0"
];

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
      return new Response(ADS_TXT_LINES.join('\n'), {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8", "Access-Control-Allow-Origin": "*" }
      });
    }

    // 🤖 2. Serve robots.txt directly from the edge
    if (path === '/robots.txt') {
      return new Response(ROBOTS_TXT_CONTENT, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    // 🗺️ 3. EDGE XML SITEMAP COMPILER (Bypasses firewall using sitemap-data.php)

    if (path === '/sitemap.xml') {
      try {
        // Fetch raw data safely via HTTP request to your host file
        const dataResponse = await fetch(`http://185.27.134.221`, {
          headers: { 'Host': 'microbim.name.ng' }
        });
        const rawText = await dataResponse.text();
        
        let blogUrlsXml = '';
        const lines = rawText.split(/\r?\n/);
        
        for (let line of lines) {
          const cleanLine = line.trim();
          if (cleanLine.includes(',')) {
            const [slug, dateCreated] = cleanLine.split(',');
            if (slug && dateCreated) {
              blogUrlsXml += `  <url>\n    <loc>https://microbim.name.ng{encodeURIComponent(slug.trim())}</loc>\n    <lastmod>${dateCreated.trim()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.65</priority>\n  </url>\n`;
            }
          }
        }

        const completeXmlSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://sitemaps.org">
  <url><loc>https://microbim.name.ng/</loc><changefreq>daily</changefreq><priority>1.00</priority></url>
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
          headers: { "Content-Type": "application/xml; charset=utf-8" }
        });
      } catch (err) {
        return new Response('Sitemap compilation error.', { status: 500 });
      }
    }

    return new Response("Not Found", { status: 404 });
  }
};
