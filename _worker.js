// ======================================================================
// ADFLOW ISOLATED EDGE PROXY - MULTI-DOMAIN COMPATIBILITY BUILD
// Save Location: Your GitHub Repository -> _worker.js
// ======================================================================

const NETWORKS = {
  'adsterra': ['celerycribbanish.com'],     
  'adcash': ['acscdn.com'],                 
  'cybertron': ['cybertronads.com'],         
  
  // HilltopAds Multi-Domain Proxy Matrix Array Setup
  'hilltopads': ['untimely-hello.com'],
  'hilltopads-pop': ['physicaldad.com']
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 🛑 HARDENED SECURITY BYPASS: Fast-track administrative interface streams
    if (
      url.pathname.includes('/adflow') || 
      url.pathname.includes('mutation.php') || 
      url.pathname.includes('config-delivery.php') ||
      url.searchParams.has('api_auth')
    ) {
      return fetch(request);
    }

    const pathParts = url.pathname.split('/'); 
    // Safely extract the first folder path subdirectory index parameter
    const folder = (pathParts && pathParts[1]) ? pathParts[1].toLowerCase() : ''; 

    // 🎯 MATCH TRACE: Check if the folder maps to any domain in our network matrix array
    if (folder && NETWORKS[folder]) {
      const domainsArray = NETWORKS[folder];
      
      // Select the active target domain safely out of the array mapping layout
      let realDomain = domainsArray[0];
      if (domainsArray.length > 1) {
        realDomain = url.searchParams.get('domain_fallback') || domainsArray[1] || domainsArray[0];
      }

      const newPath = url.pathname.replace(`/${folder}/`, '');
      const realTargetUrl = `https://${realDomain}/${newPath}${url.search}`;

      const clonedRequest = request.clone();

      const response = await fetch(realTargetUrl, {
        method: clonedRequest.method,
        headers: { 
          'User-Agent': clonedRequest.headers.get('User-Agent'), 
          'Accept': clonedRequest.headers.get('Accept'),
          'X-Forwarded-For': clonedRequest.headers.get('CF-Connecting-IP') 
        },
        body: clonedRequest.method === 'POST' ? await clonedRequest.text() : null
      });

      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('javascript') || contentType.includes('html')) {
        let text = await response.text();
        
        // Loop through and mask ALL matching domains for this specific provider key
        for (const dom of domainsArray) {
          const cleanRegex = new RegExp(dom, 'g');
          text = text.replace(cleanRegex, `${url.hostname}/${folder}`);
        }
        
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

    // Standard public webpage passthrough routing to origin host
    return fetch(request);
  }
};
