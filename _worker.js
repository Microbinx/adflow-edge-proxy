// ======================================================================
// ADFLOW ISOLATED EDGE PROXY - PRODUCTION HYBRID COMPATIBILITY BUILD
// Save Location: Your GitHub Repository -> _worker.js
// FIXED: Path extraction anomalies, stream drains, and header calculation drops.
// ======================================================================

const NETWORKS = {
  'adsterra': 'celerycribbanish.com',     
  'adcash': 'acscdn.com',                 
  'cybertron': 'cybertronads.com',
  'hilltopads': 'untimely-hello.com',
  'hilltopads-pop': 'physicaldad.com'
};

const ORIGIN_SERVER = 'microbim.name.ng'; 

// Helper utility to safely escape raw domain strings for literal RegExp generation
function escapeRegExpPattern(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Extract first routing path segment reliably
    const pathParts = url.pathname.split('/').filter(Boolean); 
    const folder = pathParts[0] ? pathParts[0].toLowerCase() : ''; 

    // Determine if the incoming request contains an active request body payload stream
    const hasActiveBody = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);

    // 1. HARDENED SECURITY BYPASS: Route backend administration files directly to the origin host
    if (
      url.pathname.includes('/adflow') || 
      url.pathname.includes('mutation.php') || 
      url.pathname.includes('config-delivery.php') ||
      url.searchParams.has('api_auth')
    ) {
      const targetOriginUrl = `https://${ORIGIN_SERVER}${url.pathname}${url.search}`;
      
      // FIXED: Forward the raw body object as an active stream to protect memory limits
      return fetch(targetOriginUrl, { 
        method: request.method, 
        headers: request.headers, 
        body: hasActiveBody ? request.body : null 
      });
    }

    // 2. DYNAMIC AD DE-CLOAK PROXY ENGINE MATRIX
    if (folder && NETWORKS[folder]) {
      const realDomain = NETWORKS[folder];
      
      // FIXED: Safely isolate prefix subfolder positions without breaking similar internal path text names
      const folderSegmentLength = pathParts[0].length + 1; // Accounting for the leading slash character
      const cleanPath = url.pathname.substring(folderSegmentLength);
      const realTargetUrl = `https://${realDomain}${cleanPath}${url.search}`;

      const advancedHeaders = new Headers(request.headers);
      
      // DEEP VISITOR PROFILE IDENTITY PASS-THROUGH
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

      // Explicitly remap host tracking records to match external destination routing pools
      advancedHeaders.set('Host', realDomain);

      const response = await fetch(realTargetUrl, {
        method: request.method,
        headers: advancedHeaders,
        body: hasActiveBody ? request.body : null
      });

      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('javascript') || contentType.includes('html')) {
        let text = await response.text();
        
        // FIXED: Safely escape target strings before running regular expression operations
        const cleanRegex = new RegExp(escapeRegExpPattern(realDomain), 'g');
        text = text.replace(cleanRegex, `${url.hostname}/${folder}`);
        
        // Assemble clean, updated outbound response headers
        const outboundHeaders = new Headers(response.headers);
        outboundHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        
        // FIXED: Drop old Content-Length references to let Cloudflare compute accurate sizes dynamically
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

    // FIXED: Keep incoming form request payloads completely intact for core site elements
    return fetch(defaultSiteUrl, { 
      method: request.method, 
      headers: nativeSiteHeaders,
      body: hasActiveBody ? request.body : null
    });
  }
};
