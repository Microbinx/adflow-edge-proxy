// ======================================================================
// ADFLOW ISOLATED EDGE PROXY - HIGH-SECURITY COMPATIBILITY BUILD
// Save Location: Your GitHub Repository -> _worker.js
// FIXED: Double-slash routing errors and enhanced client header pass-through.
// ======================================================================

const NETWORKS = {
  'adsterra': 'celerycribbanish.com',     
  'adcash': 'acscdn.com',                 
  'cybertron': 'cybertronads.com',
  'hilltopads': 'untimely-hello.com',
  'hilltopads-pop': 'physicaldad.com'
};

const ORIGIN_SERVER = 'microbim.name.ng'; 

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Split paths and remove blank array slots to safely identify the routing folder
    const pathParts = url.pathname.split('/').filter(Boolean); 
    const folder = pathParts[0] ? pathParts[0].toLowerCase() : ''; 

    // 1. HARDENED SECURITY BYPASS: Route backend administration files to the origin
    if (
      url.pathname.includes('/adflow') || 
      url.pathname.includes('mutation.php') || 
      url.pathname.includes('config-delivery.php') ||
      url.searchParams.has('api_auth')
    ) {
      // FIXED: Removed the extra "/" separating ORIGIN_SERVER and url.pathname
      const targetOriginUrl = `https://${ORIGIN_SERVER}${url.pathname}${url.search}`;
      return fetch(targetOriginUrl, { 
        method: request.method, 
        headers: request.headers, 
        body: request.method === 'POST' ? await request.text() : null 
      });
    }

    // 2. DYNAMIC AD DE-CLOAK PROXY MATRIX
    if (folder && NETWORKS[folder]) {
      const realDomain = NETWORKS[folder];
      
      // Reconstruct clean paths free of the proxy prefix subfolder
      const cleanPath = url.pathname.replace(`/${pathParts[0]}`, '');
      const realTargetUrl = `https://${realDomain}${cleanPath}${url.search}`;

      const clonedRequest = request.clone();
      const advancedHeaders = new Headers(clonedRequest.headers);
      
      // DEEP VISITOR PROFILE IDENTITY INJECTION
      // These credentials convince the ad server that the connection is an organic mobile/desktop visitor
      const clientIP = clonedRequest.headers.get('CF-Connecting-IP') || '';
      advancedHeaders.set('X-Forwarded-For', clientIP);
      advancedHeaders.set('X-Real-IP', clientIP);
      advancedHeaders.set('Client-IP', clientIP);
      
      // Forward Cloudflare edge geolocation attributes safely
      if (clonedRequest.headers.has('CF-IPCountry')) {
        advancedHeaders.set('X-Client-Geo-Country', clonedRequest.headers.get('CF-IPCountry'));
      }
      
      // ADDED: Device type evaluation matrix pass-through (e.g., desktop, mobile, tablet)
      if (clonedRequest.headers.has('CF-Device-Type')) {
        advancedHeaders.set('X-Device-Type', clonedRequest.headers.get('CF-Device-Type'));
      }

      const response = await fetch(realTargetUrl, {
        method: clonedRequest.method,
        headers: advancedHeaders,
        body: clonedRequest.method === 'POST' ? await clonedRequest.text() : null
      });

      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('javascript') || contentType.includes('html')) {
        let text = await response.text();
        const cleanRegex = new RegExp(realDomain, 'g');
        text = text.replace(cleanRegex, `${url.hostname}/${folder}`);
        
        return new Response(text, { 
          status: response.status,
          headers: { 
            'Content-Type': contentType,
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' 
          } 
        });
      }
      return response;
    }

    // 3. DEFAULT STATIC ELEMENT ROUTING
    // FIXED: Corrected string template interpolation layout to prevent 404 path breaks
    const defaultSiteUrl = `https://${ORIGIN_SERVER}${url.pathname}${url.search}`;
    return fetch(defaultSiteUrl, { 
      method: request.method, 
      headers: request.headers 
    });
  }
};
