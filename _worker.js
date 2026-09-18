// ======================================================================
// ADFLOW ISOLATED EDGE PROXY - PRODUCTION CORES (UPGRADED VERSION)
// STATUS: 100% Operational. Fixed Path Array Parsing & Added Verification Bypasses.
// ======================================================================

 const NETWORKS = {
  'adsterra': 'celerycribbanish.com',     
  'adcash': 'acscdn.com',                 
  'cybertron': 'cybertronads.com',
  'hilltopads': 'untimely-hello.com',
  'hilltopads-pop': 'physicaldad.com'
};

const ORIGIN_SERVER = 'backend-direct.microbim.name.ng';

// 🗺️ HIGH-CPM GLOBAL RESIDENTIAL & CARRIER IP POOLS
const HIGH_CPM_POOLS = {
  'US': [ // United States - Highest CPM Tier
    '172.56.21.84', '172.56.42.190', '66.249.83.41', '66.249.92.115',
    '98.137.12.56', '98.137.45.201', '107.77.210.44', '107.77.218.132'
  ],
  'GB': [ // United Kingdom
    '25.102.34.89', '25.102.45.201', '82.165.12.44', '82.165.44.190',
    '146.198.4.22', '146.198.23.104', '185.86.12.87', '185.86.56.14'
  ],
  'DE': [ // Germany
    '46.112.3.49',  '46.112.22.118', '78.46.102.33', '78.46.204.76',
    '95.90.5.12',   '95.90.67.90',   '176.9.9.43',   '176.9.77.21'
  ],
  'CA': [ // Canada
    '184.75.1.66',  '184.75.88.109', '198.50.4.15',  '198.50.99.210',
    '204.101.5.11', '204.101.44.88', '64.233.12.41', '64.233.56.110'
  ]
};

function escapeRegExpPattern(string) {
  return string.replace(/[.*+?^\${}()|[\]\\]/g, '\\$&');
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean); 
    
    // ✅ ACTIVE PERMANENT FIX: Safe array parsing to prevent Error 1101 crashes
    const folder = pathParts.length > 0 ? pathParts[0].toLowerCase().trim() : ''; 

    const hasActiveBody = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);

    // ======================================================================
    // 🌐 0. EDGE-LAYER XML SITEMAP COMPILER (UNIVERSAL PARSING ENGINE)
    // ======================================================================
    if (url.pathname.toLowerCase() === '/sitemap.xml' || url.pathname.toLowerCase() === '/sitemap.php') {
     try {
        const dataResponse = await fetch(`https://${ORIGIN_SERVER}/sitemap-data.php`);
        const rawText = await dataResponse.text();
        
        let blogUrlsXml = '';
        const lines = rawText.split(/\r?\n/);
        
        for (let line of lines) {
          const cleanLine = line.trim();
          if (cleanLine.includes(',')) {
            const [slug, dateCreated] = cleanLine.split(',');
            if (slug && dateCreated) {
              blogUrlsXml += `  <url>\n    <loc>https://microbim.name.ng${slug.trim()}</loc>\n    <lastmod>${dateCreated.trim()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.65</priority>\n  </url>\n`;
            }
          }
        }

        const completeXmlSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://sitemaps.org">
  <url>
    <loc>https://microbim.name.ng</loc>
    <changefreq>daily</changefreq>
    <priority>1.00</priority>
  </url>
  <url>
    <loc>https://microbim.name.ng/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://microbim.name.ng/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://microbim.name.ng/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://microbim.name.ng/website</loc>
    <changefreq>monthly</changefreq>
    <priority>0.70</priority>
  </url>
  <url>
    <loc>https://microbim.name.ng/mobileapp</loc>
    <changefreq>monthly</changefreq>
    <priority>0.70</priority>
  </url>
  <url>
    <loc>https://microbim.name.ng/solutions</loc>
    <changefreq>monthly</changefreq>
    <priority>0.70</priority>
  </url>
  <url>
    <loc>https://microbim.name.ng/academy</loc>
    <changefreq>weekly</changefreq>
    <priority>0.70</priority>
  </url>
  <url>
    <loc>https://microbim.name.ng/store</loc>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>
  <url>
    <loc>https://microbim.name.ng/download</loc>
    <changefreq>weekly</changefreq>
    <priority>0.75</priority>
  </url>
  <url>
    <loc>https://microbim.name.ng/privacy</loc>
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
        return new Response('Sitemap runtime compilation error.', { status: 500 });
      }
    }

    // ======================================================================
    // 🛡️ 1. HARDENED SECURITY BYPASS, ADMIN PANELS, & ADS.TXT CHANNELS
    // Added exemptions for adflow-injector, sitemap-data, robots.txt, and ads.txt
    // ======================================================================
    if (
      url.pathname.includes('/adflow') || 
      url.pathname.includes('mutation.php') || 
      url.pathname.includes('adflow-injector.php') ||
      url.pathname.includes('sitemap-data.php') ||
      url.pathname.includes('robots.txt') ||
      url.pathname.includes('ads.txt') ||
      url.pathname.includes('blog') ||
      url.pathname.includes('contact') ||
      url.searchParams.has('api_auth')
    ) {
      const targetOriginUrl = `https://` + ORIGIN_SERVER + url.pathname + url.search;
      const clonedRequestForOrigin = request.clone();
      
      return fetch(targetOriginUrl, { 
        method: request.method, 
        headers: clonedRequestForOrigin.headers, 
        body: hasActiveBody ? clonedRequestForOrigin.body : null 
      });
    }

    // ======================================================================
    // 🚀 2. DYNAMIC AD DE-CLOAK PROXY ENGINE MATRIX (HIGH-CPM ROTATION)
    // ======================================================================
    if (folder && NETWORKS[folder]) {
      const realDomain = NETWORKS[folder];
      const cleanPath = '/' + pathParts.slice(1).join('/');
      const realTargetUrl = `https://` + realDomain + cleanPath + url.search;

      const advancedHeaders = new Headers(request.headers);
      advancedHeaders.set('Accept-Encoding', 'identity');
      advancedHeaders.set('Host', realDomain);

      // 🛡️ Wipes out identifying proxy markers, WebRTC leaks, and data traces
      const leakyHeaders = [
        'Via', 'Forwarded', 'X-Forwarded', 'X-Forwarded-By', 'Forwarded-For',
        'Proxy-Connection', 'Max-Forwards', 'X-Client-IP', 'X-Real-IP',
        'X-ProxyUser-Ip', 'X-True-Client-IP', 'True-Client-IP', 'Client-IP',
        'CF-Worker', 'CF-Ray', 'CF-Visitor', 'X-Cloudflare-Proxy', 'CDN-Loop'
      ];
      leakyHeaders.forEach(header => advancedHeaders.delete(header));

      // ⚡ ROTATE HIGH-CPM GEOLOCATIONS DYNAMICALLY
      const countries = Object.keys(HIGH_CPM_POOLS);
      const selectedCountry = countries[Math.floor(Math.random() * countries.length)];
      const currentPool = HIGH_CPM_POOLS[selectedCountry];
      const maskedIP = currentPool[Math.floor(Math.random() * currentPool.length)];

      // ⚡ ENFORCE GEOLOCATION SYMMETRY FOR FOREIGN NETWORKS
      advancedHeaders.set('X-Forwarded-For', maskedIP);
      advancedHeaders.set('X-Real-IP', maskedIP);
      advancedHeaders.set('Client-IP', maskedIP);
      
      advancedHeaders.set('CF-IPCountry', selectedCountry); 
      advancedHeaders.set('X-Client-Geo-Country', selectedCountry);
      advancedHeaders.set('X-Forwarded-Proto', 'https');
      advancedHeaders.set('Connection', 'keep-alive');

      const response = await fetch(realTargetUrl, {
        method: request.method,
        headers: advancedHeaders,
        body: hasActiveBody ? request.body.clone() : null
      });

      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('javascript') || contentType.includes('html')) {
        let text = await response.text();
        
        const cleanRegex = new RegExp(escapeRegExpPattern(realDomain), 'g');
        text = text.replace(cleanRegex, url.hostname + '/' + folder);
        
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
    // CHANGE `https://` TO `http://` below to bypass the invalid certificate block:
    const defaultSiteUrl = `http://` + ORIGIN_SERVER + url.pathname + url.search;
    
    const nativeSiteHeaders = new Headers(request.headers);
    
    // CRITICAL: Remind the server that the visitor requested the main domain files
    nativeSiteHeaders.set('Host', 'microbim.name.ng'); 

    return fetch(defaultSiteUrl, { 
      method: request.method, 
      headers: nativeSiteHeaders,
      body: hasActiveBody ? request.body : null
    });

  }
};
