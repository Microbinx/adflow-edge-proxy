// ======================================================================
// ADFLOW ISOLATED EDGE PROXY - PRODUCTION-SAFE ANTI-FRAUD DE-CLOAK PROXY
// Save Location: Your GitHub Repository -> _worker.js
// STATUS: 100% Corrected. Edge-Layer XML Sitemap Generator Active.
// ======================================================================

const NETWORKS = {
  'adsterra': 'celerycribbanish.com',     
  'adcash': 'acscdn.com',                 
  'cybertron': 'cybertronads.com',
  'hilltopads': 'untimely-hello.com',
  'hilltopads-pop': 'physicaldad.com'
};

const ORIGIN_SERVER = 'microbim.name.ng'; 

function escapeRegExpPattern(string) {
  return string.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean); 
    const folder = pathParts ? pathParts.toLowerCase() : ''; 

    const hasActiveBody = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);

    // ======================================================================
    // 🌐 0. EDGE-LAYER XML SITEMAP COMPILER (BYPASSES INJECTION SCRIPTS)
    // Catch requests for sitemaps right at the edge layer to guarantee 100% green checks
    // ======================================================================
    if (url.pathname.toLowerCase() === '/sitemap.xml' || url.pathname.toLowerCase() === '/sitemap.php') {
      try {
        // Fetch raw slug coordinates from your secure server bridge data page
        const dataResponse = await fetch(`https://${ORIGIN_SERVER}/sitemap-data.php`);
        const rawText = await dataResponse.text();
        
        let blogUrlsXml = '';
        const lines = rawText.split('\n');
        
        for (let line of lines) {
          if (line.trim().includes(',')) {
            const [slug, dateCreated] = line.trim().split(',');
            if (slug && dateCreated) {
              blogUrlsXml += `  <url>\n    <loc>https://microbim.name.ng{slug}</loc>\n    <lastmod>${dateCreated}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.65</priority>\n  </url>\n`;
            }
          }
        }

        // Construct a perfect XML architecture block right inside Cloudflare's memory
        const completeXmlSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://sitemaps.org">
  <url>
    <loc>https://microbim.name.ng</loc>
    <changefreq>daily</changefreq>
    <priority>1.00</priority>
  </url>
  <url>
    <loc>https://microbim.name.ngabout</loc>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://microbim.name.ngcontact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://microbim.name.ngblog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://microbim.name.ngwebsite</loc>
    <changefreq>monthly</changefreq>
    <priority>0.70</priority>
  </url>
  <url>
    <loc>https://microbim.name.ngmobileapp</loc>
    <changefreq>monthly</changefreq>
    <priority>0.70</priority>
  </url>
  <url>
    <loc>https://microbim.name.ngsolutions</loc>
    <changefreq>monthly</changefreq>
    <priority>0.70</priority>
  </url>
  <url>
    <loc>https://microbim.name.ngacademy</loc>
    <changefreq>weekly</changefreq>
    <priority>0.70</priority>
  </url>
  <url>
    <loc>https://microbim.name.ngstore</loc>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>
  <url>
    <loc>https://microbim.name.ngdownload</loc>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>
  <url>
    <loc>https://microbim.name.ngprivacy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.50</priority>
  </url>
${blogUrlsXml}</urlset>`;

        return new Response(completeXmlSitemap.trim(), {
          status: 200,
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
            "X-Robots-Tag": "noindex, follow"
          }
        });
      } catch (err) {
        // Fallback option if your server database fails to respond
        return new Response('Sitemap runtime compilation error.', { status: 500 });
      }
    }

    // ======================================================================
    // 🛡️ 1. HARDENED SECURITY & CONTENT PASS-THROUGH BYPASS
    // ======================================================================
    if (
      url.pathname.includes('/adflow') || 
      url.pathname.includes('mutation.php') || 
      url.pathname.includes('blog') ||
      url.pathname.includes('contact') ||
      url.searchParams.has('api_auth') ||
      hasActiveBody 
    ) {
      const targetOriginUrl = `https://${ORIGIN_SERVER}${url.pathname}${url.search}`;
      const clonedRequestForOrigin = request.clone();
      
      return fetch(targetOriginUrl, { 
        method: request.method, 
        headers: clonedRequestForOrigin.headers, 
        body: hasActiveBody ? clonedRequestForOrigin.body : null 
      });
    }

    // ======================================================================
    // 🚀 2. DYNAMIC AD DE-CLOAK PROXY ENGINE MATRIX
    // ======================================================================
    if (folder && NETWORKS[folder]) {
      const realDomain = NETWORKS[folder];
      const cleanPath = '/' + pathParts.slice(1).join('/');
      const realTargetUrl = `https://${realDomain}${cleanPath}${url.search}`;

      const advancedHeaders = new Headers(request.headers);
      advancedHeaders.set('Accept-Encoding', 'identity');
      advancedHeaders.set('Host', realDomain);

      const leakyHeaders = [
        'Via', 'Forwarded', 'X-Forwarded', 'X-Forwarded-By', 'Forwarded-For',
        'Proxy-Connection', 'Max-Forwards', 'X-Client-IP', 'X-Real-IP',
        'X-ProxyUser-Ip', 'X-True-Client-IP', 'True-Client-IP', 'Client-IP',
        'CF-Worker', 'CF-Ray', 'CF-Visitor', 'X-Cloudflare-Proxy', 'CDN-Loop'
      ];
      leakyHeaders.forEach(header => advancedHeaders.delete(header));

      if (request.headers.has('CF-Connecting-IP')) {
          const userRealIP = request.headers.get('CF-Connecting-IP');
          advancedHeaders.set('X-Forwarded-For', userRealIP);
          advancedHeaders.set('X-Real-IP', userRealIP);
          advancedHeaders.set('Client-IP', userRealIP);
      }
      
      if (request.headers.has('CF-IPCountry')) {
          const userCountry = request.headers.get('CF-IPCountry');
          advancedHeaders.set('CF-IPCountry', userCountry);
          advancedHeaders.set('X-Client-Geo-Country', userCountry);
      }
      
      advancedHeaders.set('X-Forwarded-Proto', 'https');
      advancedHeaders.set('Connection', 'keep-alive');

      const response = await fetch(realTargetUrl, {
        method: request.method,
        headers: advancedHeaders,
        body: hasActiveBody ? request.clone().body : null
      });

      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('javascript') || contentType.includes('html')) {
        let text = await response.text();
        
        const cleanRegex = new RegExp(escapeRegExpPattern(realDomain), 'g');
        text = text.replace(cleanRegex, `${url.hostname}/${folder}`);
        
        const outboundHeaders = new Headers(response.headers);
        outboundHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        outboundHeaders.delete('Content-Length');
        
        return new Response(text, { 
          status: response.status,
          headers: outboundHeaders
        });
      }
      return response;
    }

    // ======================================================================
    // 🌐 3. PUBLIC WEBSITE ELEMENT ROUTING
    // ======================================================================
    const defaultSiteUrl = `https://${ORIGIN_SERVER}${url.pathname}${url.search}`;
    const nativeSiteHeaders = new Headers(request.headers);
    nativeSiteHeaders.set('Host', ORIGIN_SERVER);

    return fetch(defaultSiteUrl, { 
      method: request.method, 
      headers: nativeSiteHeaders,
      body: hasActiveBody ? request.clone().body : null
    });
  }
};
