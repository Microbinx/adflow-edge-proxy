// ======================================================================
// ADFLOW ISOLATED EDGE PROXY - RESILIENT USER-REFLECTION BUILD
// Save Location: Your GitHub Repository -> _worker.js
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
    
    // Safely parse out path segments without dropping elements
    const pathParts = url.pathname.split('/').filter(Boolean); 
    const folder = pathParts[0] ? pathParts[0].toLowerCase() : ''; 

    // FIXED: Removed invalid multi-slash assignments (/${url.pathname}/)
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
        body: request.method === 'POST' ? await request.text() : null 
      });
    }

    // IF THE PATH MATCHES AN AD PROXY FOLDER, RUN THE VISITOR REFLECTION MATRIX
    if (folder && NETWORKS[folder]) {
      const realDomain = NETWORKS[folder];
      
      // Reconstruct clean paths free of duplicate slashes
      const cleanPath = url.pathname.replace(`/${pathParts[0]}`, '');
      const realTargetUrl = `https://${realDomain}${cleanPath}${url.search}`;

      const clonedRequest = request.clone();
      const advancedHeaders = new Headers(clonedRequest.headers);
      
      // FORCE VISITOR NETWORK PROFILE REFLECTION
      // This tricks the ad network's edge into validating the true visitor instead of Cloudflare
      const clientIP = clonedRequest.headers.get('CF-Connecting-IP') || '';
      advancedHeaders.set('X-Forwarded-For', clientIP);
      advancedHeaders.set('X-Real-IP', clientIP);
      advancedHeaders.set('Client-IP', clientIP);
      
      if (clonedRequest.headers.has('CF-IPCountry')) {
        advancedHeaders.set('X-Client-Geo-Country', clonedRequest.headers.get('CF-IPCountry'));
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

    // Pass standard public website pages safely to your custom origin server
    const defaultSiteUrl = `https://${ORIGIN_SERVER}${url.pathname}${url.search}`;
    return fetch(defaultSiteUrl, { 
      method: request.method, 
      headers: request.headers 
    });
  }
};
