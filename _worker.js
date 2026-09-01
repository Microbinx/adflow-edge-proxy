// ======================================================================
// ADFLOW ISOLATED EDGE PROXY - PRODUCTION HYBRID COMPATIBILITY BUILD
// Save Location: Your GitHub Repository -> _worker.js
// FIXED: Immutable stream locks, binary gzip corruption, and relative subpaths
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

    // FIXED: Only assign body to method types that natively validate payload contents
    const hasActiveBody = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);

    // 1. HARDENED SECURITY BYPASS
    if (
      url.pathname.includes('/adflow') || 
      url.pathname.includes('mutation.php') || 
      url.pathname.includes('config-delivery.php') ||
      url.searchParams.has('api_auth')
    ) {
      const targetOriginUrl = `https://${ORIGIN_SERVER}${url.pathname}${url.search}`;
      
      // FIXED: Forward the raw body stream securely
      return fetch(targetOriginUrl, { 
        method: request.method, 
        headers: request.headers, 
        body: hasActiveBody ? request.body : null 
      });
    }

    // 2. DYNAMIC AD DE-CLOAK PROXY ENGINE MATRIX
    if (folder && NETWORKS[folder]) {
      const realDomain = NETWORKS[folder];
      
      // FIXED: Ensure clean path preserves a valid leading forward slash
      const cleanPath = '/' + pathParts.slice(1).join('/');
      const realTargetUrl = `https://${realDomain}${cleanPath}${url.search}`;

      const advancedHeaders = new Headers(request.headers);
      
      // FIXED: Ask upstream server for uncompressed text data so response.text() does not corrupt
      advancedHeaders.set('Accept-Encoding', 'identity');

      const clientIP = request.headers.get('CF-Connecting-IP') || '';
      advancedHeaders.set('X-Forwarded-For', clientIP);
      advancedHeaders.set('X-Real-IP', clientIP);
      advancedHeaders.set('Client-IP', clientIP);
      
      if (request.headers.has('CF-IPCountry')) {
        advancedHeaders.set('X-Client-Geo-Country', request.headers.get('CF-IPCountry'));
      }
      if (request.headers.has('CF-Device-Type')) {
        advancedHeaders.set('X-Device-Type', request.headers.get('CF-Device-Type'));
      }

      advancedHeaders.set('Host', realDomain);

      // FIXED: Safely clone the request or pipe body to avoid runtime stream exceptions
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
