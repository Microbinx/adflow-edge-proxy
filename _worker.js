// ======================================================================
// ADFLOW ISOLATED EDGE PROXY - MULTI-DOMAIN PRODUCTION BUILD
// Save Location: Your GitHub Repository -> _worker.js
// ======================================================================

const NETWORKS = {
  'adsterra': ['celerycribbanish.com'],     
  // âš¡ UPDATED: HilltopAds now whitelists both legacy and raw popunder domains cleanly
  'hilltopads': ['untimely-hello.com'],
  'hilltopads-pop': ['physicaldad.com'],    
  'adcash': ['acscdn.com'],                 
  'cybertron': ['cybertronads.com']         
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/'); 
    const folder = pathParts ? pathParts[1].toLowerCase() : ''; 

    // ðŸ›‘ AD-FOLDER SECURITY BYPASS
    if (
      url.pathname.includes('/adflow') || 
      url.pathname.includes('mutation.php') || 
      url.pathname.includes('config-delivery.php') ||
      url.searchParams.has('api_auth')
    ) {
      return fetch(request);
    }

    // ðŸŽ¯ MATCH TRACE: Check if the folder maps to any domain in our network matrix array
    if (folder && NETWORKS[folder]) {
      const domainsArray = NETWORKS[folder];
      
      // Determine the active target domain (Default to the first item, or check URL metrics)
      // For popunders using alternative assets, we match the incoming stream layout
      let realDomain = domainsArray[0];
      
      // If handling a multi-domain provider, safely match our routing target string
      if (domainsArray.length > 1) {
        // Automatically selects physicaldad.com if that path target is requested
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

    return fetch(request);
  }
};
