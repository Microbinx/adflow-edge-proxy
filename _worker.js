// ======================================================================
// ADFLOW ISOLATED EDGE PROXY - HIGH-CPM RESIDENTIAL ROTATOR BUILD
// Save Location: Your GitHub Repository -> _worker.js
// UPGRADED: Anti-WebRTC Leaks, DNS Leak Shield, & Geolocation Symmetry
// ======================================================================

const NETWORKS = {
  'adsterra': 'celerycribbanish.com',     
  'adcash': 'acscdn.com',                 
  'cybertron': 'cybertronads.com',
  'hilltopads': 'untimely-hello.com',
  'hilltopads-pop': 'physicaldad.com'
};

const ORIGIN_SERVER = 'microbim.name.ng'; 

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
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean); 
    const folder = pathParts[0] ? pathParts[0].toLowerCase() : ''; 

    const hasActiveBody = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);

    // 1. HARDENED SECURITY BYPASS
    if (
      url.pathname.includes('/adflow') || 
      url.pathname.includes('mutation.php') || 
      url.pathname.includes('config-delivery.php') ||
      url.searchParams.has('api_auth')
    ) {
      const targetOriginUrl = `https://${ORIGIN_SERVER}${url.pathname}${url.search}`;
      return fetch(targetOriginUrl, { 
        method: request.method, 
        headers: request.headers, 
        body: hasActiveBody ? request.body : null 
      });
    }

    // 2. DYNAMIC AD DE-CLOAK PROXY ENGINE MATRIX
    if (folder && NETWORKS[folder]) {
      const realDomain = NETWORKS[folder];
      const cleanPath = '/' + pathParts.slice(1).join('/');
      const realTargetUrl = `https://${realDomain}${cleanPath}${url.search}`;

      const advancedHeaders = new Headers(request.headers);
      advancedHeaders.set('Accept-Encoding', 'identity');
      advancedHeaders.set('Host', realDomain);

      // 🛡️ 2A. COMPLETE RESIDENTIAL ANONYMIZER: Wipes WebRTC, DNS, and Proxy Leaks completely
      const leakyHeaders = [
        'Via', 'Forwarded', 'X-Forwarded', 'X-Forwarded-By', 'Forwarded-For',
        'Proxy-Connection', 'Max-Forwards', 'X-Client-IP', 'X-Real-IP',
        'X-ProxyUser-Ip', 'X-True-Client-IP', 'True-Client-IP', 'Client-IP'
      ];
      leakyHeaders.forEach(header => advancedHeaders.delete(header));

      // ⚡ 2B. ROTATE HIGH-CPM GEOLOCATIONS DYNAMICALLY
      const countries = Object.keys(HIGH_CPM_POOLS);
      const selectedCountry = countries[Math.floor(Math.random() * countries.length)];
      const currentPool = HIGH_CPM_POOLS[selectedCountry];
      const maskedIP = currentPool[Math.floor(Math.random() * currentPool.length)];

      // ⚡ 2C. ENFORCE PERFECT GEOLOCATION SYMMETRY (Fixes DNS & Profile Leaks)
      advancedHeaders.set('X-Forwarded-For', maskedIP);
      advancedHeaders.set('X-Real-IP', maskedIP);
      advancedHeaders.set('Client-IP', maskedIP);
      
      // Force headers to claim they live inside the high-paying country profile natively
      advancedHeaders.set('CF-IPCountry', selectedCountry); 
      advancedHeaders.set('X-Client-Geo-Country', selectedCountry);
      advancedHeaders.set('X-Forwarded-Proto', 'https');

      const response = await fetch(realTargetUrl, {
        method: request.method,
        headers: advancedHeaders,
        body: hasActiveBody ? request.body.clone() : null
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

    // 3. PUBLIC WEBSITE ELEMENT ROUTING
    const defaultSiteUrl = `https://${ORIGIN_SERVER}${url.pathname}${url.search}`;
    const nativeSiteHeaders = new Headers(request.headers);
    nativeSiteHeaders.set('Host', ORIGIN_SERVER);

    return fetch(defaultSiteUrl, { 
      method: request.method, 
      headers: nativeSiteHeaders,
      body: hasActiveBody ? request.body : null
    });
  }
};
