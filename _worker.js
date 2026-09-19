// ======================================================================
// CLOUDFLARE EDGE BYPASS & AD SYSTEM PROXY FOR MICROBIM.NAME.NG
// ======================================================================

// 🏠 1. Your unique InfinityFree hosting system target identifier
const INFINITYFREE_ORIGIN = 'if0_://epizy.com'; 

// 📋 Your Adsterra network mapping for edge delivery
const NETWORKS = {
  'adsterra': 'celerycribbanish.com'
};

// 🗺️ Active Adsterra Ads.txt lines for immediate network verification
const ADS_TXT_LINES = [
  "google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0",
  "adsterra.com, 182921, DIRECT, f7343198008ae3eedc1ddfaccd05a684"
];

const ROBOTS_TXT_CONTENT = `User-agent: *
Allow: /
Disallow: /wp-admin/
Disallow: /wp-includes/

Sitemap: https://microbim.name.ng`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.toLowerCase();
    
    const pathParts = url.pathname.split('/').filter(Boolean); 
    const folder = pathParts.length > 0 ? pathParts[0].toLowerCase().trim() : '';

    // 🛡️ INTERCEPT A: Serve ads.txt directly from Cloudflare Edge
    if (path === '/ads.txt') {
      return new Response(ADS_TXT_LINES.join('\n'), {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=86400",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // 🤖 INTERCEPT B: Serve robots.txt directly from the edge
    if (path === '/robots.txt') {
      return new Response(ROBOTS_TXT_CONTENT, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" }
      });
    }

    // 🌐 INTERCEPT C: Handle Adsterra Proxy Mapping paths cleanly
    if (folder && NETWORKS[folder]) {
      const targetDomain = NETWORKS[folder];
      const cleanPath = '/' + pathParts.slice(1).join('/');
      const proxyUrl = `https://${targetDomain}${cleanPath}${url.search}`;

      const updatedHeaders = new Headers(request.headers);
      updatedHeaders.set('Host', targetDomain);

      const dropHeaders = ['Via', 'Forwarded', 'X-Forwarded-For', 'X-Real-IP'];
      dropHeaders.forEach(h => updatedHeaders.delete(h));

      try {
        const response = await fetch(proxyUrl, {
          method: request.method,
          headers: updatedHeaders,
          body: ['POST', 'PUT', 'PATCH'].includes(request.method) ? request.body.clone() : null
        });

        const contentType = response.headers.get('Content-Type') || '';
        if (contentType.includes('javascript') || contentType.includes('html')) {
          let bodyText = await response.text();
          const rewriteRegex = new RegExp(targetDomain, 'g');
          bodyText = bodyText.replace(rewriteRegex, `${url.hostname}/${folder}`);
          
          return new Response(bodyText, {
            status: response.status,
            headers: response.headers
          });
        }
        return response;
      } catch (err) {
        return new Response('Edge Proxy Communication Error.', { status: 502 });
      }
    }

    // 🟢 FALLBACK: Correctly route public human visitors to the backend host domain
    const cleanOriginUrl = `http://${INFINITYFREE_ORIGIN}${url.pathname}${url.search}`;
    const cleanHeaders = new Headers(request.headers);
    
    // InfinityFree requires the host header to match your custom domain to route properly
    cleanHeaders.set('Host', 'microbim.name.ng'); 

    return fetch(cleanOriginUrl, {
      method: request.method,
      headers: cleanHeaders,
      body: ['POST', 'PUT', 'PATCH'].includes(request.method) ? request.body : null
    });
  }
};
