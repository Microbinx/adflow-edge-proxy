// ======================================================================
// ADFLOW ISOLATED EDGE PROXY - PRODUCTION-SAFE ANTI-FRAUD DE-CLOAK PROXY
// Save Location: Your GitHub Repository -> _worker.js
// STATUS: 100% Corrected. Restored Real IP/Geo Metrics & Native Tracking Folders.
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
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean); 
    const folder = pathParts[0] ? pathParts[0].toLowerCase() : ''; 

    const hasActiveBody = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);

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
      
      // FIX: Clone the request to prevent stream destruction crashes on form submissions
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

      // 🛡️ 2A. PRIVACY ENHANCEMENT: Wipes identifying backend server fields completely
      const leakyHeaders = [
        'Via', 'Forwarded', 'X-Forwarded', 'X-Forwarded-By', 'Forwarded-For',
        'Proxy-Connection', 'Max-Forwards', 'X-Client-IP', 'X-Real-IP',
        'X-ProxyUser-Ip', 'X-True-Client-IP', 'True-Client-IP', 'Client-IP'
      ];
      leakyHeaders.forEach(header => advancedHeaders.delete(header));

      // ⚡ 2B. ANTI-FRAUD MAPPING: Feeds the ad network the real visitor's IP and Country.
      // This stops them from marking your traffic as automated data center bots!
      if (request.headers.has('CF-Connecting-IP')) {
          const userRealIP = request.headers.get('CF-Connecting-IP');
          advancedHeaders.set('X-Forwarded-For', userRealIP);
          advancedHeaders.set('X-Real-IP', userRealIP);
          advancedHeaders.set('Client-IP', userRealIP);
      }
      
      if (request.headers.has('CF-IPCountry')) {
          advancedHeaders.set('CF-IPCountry', request.headers.get('CF-IPCountry'));
      }
      
      advancedHeaders.set('X-Forwarded-Proto', 'https');

      // Fetch the ad asset from the network using our clean headers
      const response = await fetch(realTargetUrl, {
        method: request.method,
        headers: advancedHeaders,
        body: hasActiveBody ? request.clone().body : null
      });

      // Rewrite domain footprints inside Javascript/HTML tracking assets on the fly
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
