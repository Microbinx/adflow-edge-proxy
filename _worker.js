// ======================================================================
// ADFLOW ISOLATED EDGE PROXY - HARDENED VISITOR REFLECTION BUILD
// Save Location: Your GitHub Repository -> _worker.js
// FIXED: Path parsing array indexing error and string mutation bounds
// ======================================================================

const NETWORKS = {
  'adsterra': 'celerycribbanish.com',     
  'adcash': 'acscdn.com',                 
  'cybertron': 'cybertronads.com',
  
  // HilltopAds Multi-Domain Proxy Matrix Exception Mapping
  'hilltopads': 'untimely-hello.com',
  'hilltopads-pop': 'physicaldad.com'
};

const ORIGIN_SERVER = 'microbim.name.ng'; 

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/'); 
    
    // 🎯 FIXED: Correctly pick the first subfolder path and cast it to lowercase
    const folder = (pathParts && pathParts[1]) ? pathParts[1].toLowerCase() : ''; 

    // 🔒 HARDENED SECURITY BYPASS: Keep critical core configurations matching the physical origin
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

    // 🛡️ AD PROXY DE-CLOAK MATRIX WITH VISITOR REFLECTION FAST-TRACK
    if (folder && NETWORKS[folder]) {
      const realDomain = NETWORKS[folder];
      const newPath = url.pathname.replace(`/${folder}/`, '');
      const realTargetUrl = `https://${realDomain}/${newPath}${url.search}`;

      const clonedRequest = request.clone();
      
      // Inject strict client geolocation profiles to satisfy advanced fraud checkers
      const passingHeaders = new Headers(clonedRequest.headers);
      passingHeaders.set('X-Forwarded-For', clonedRequest.headers.get('CF-Connecting-IP') || '');
      passingHeaders.set('X-Real-IP', clonedRequest.headers.get('CF-Connecting-IP') || '');
      
      if (clonedRequest.headers.has('CF-IPCountry')) {
        passingHeaders.set('CF-IPCountry', clonedRequest.headers.get('CF-IPCountry'));
      }

      const response = await fetch(realTargetUrl, {
        method: clonedRequest.method,
        headers: passingHeaders,
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
