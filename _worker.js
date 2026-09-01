// ======================================================================
// ADFLOW ISOLATED EDGE PROXY - RESILIENT USER-REFLECTION BUILD
// Save Location: Your GitHub Repository -> _worker.js
// FIXED: Repaired array path replacing syntax and dynamic Hilltop mappings.
// ======================================================================

const NETWORKS = {
  'adsterra': 'celerycribbanish.com',     
  'adcash': 'acscdn.com',                 
  'cybertron': 'cybertronads.com',
  'hilltopads': 'untimely-hello.com'
};

const ORIGIN_SERVER = 'microbim.name.ng'; 

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Split path into clean segments, removing empty spots
    const pathParts = url.pathname.split('/').filter(Boolean); 
    const folder = pathParts[0] ? pathParts[0].toLowerCase() : ''; 

    // 1. BACKEND OVERRIDE BYPASS ROUTING
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

    // 2. DYNAMIC AD DE-CLOAK PROXY ENGINE
    if (folder && (NETWORKS[folder] || folder === 'hilltopads')) {
      let realDomain = NETWORKS[folder] || 'untimely-hello.com';
      
      // FIXED: Automatically detect Interstitial/InPush formats and route to Hilltop's pop domain
      if (folder === 'hilltopads' && (url.pathname.includes('pop') || url.pathname.includes('inter') || url.pathname.includes('push'))) {
        realDomain = 'physicaldad.com';
      }

      // FIXED: Correct path extraction indexing logic to prevent 404 breaks
      const cleanPath = url.pathname.substring(url.pathname.indexOf(folder) + folder.length);
      const realTargetUrl = `https://${realDomain}${cleanPath}${url.search}`;

      const clonedRequest = request.clone();
      const advancedHeaders = new Headers(clonedRequest.headers);
      
      // DEEP VISITOR PROFILE IDENTITY PASS-THROUGH
      const clientIP = clonedRequest.headers.get('CF-Connecting-IP') || '';
      advancedHeaders.set('X-Forwarded-For', clientIP);
      advancedHeaders.set('X-Real-IP', clientIP);
      advancedHeaders.set('Client-IP', clientIP);
      
      if (clonedRequest.headers.has('CF-IPCountry')) {
        advancedHeaders.set('X-Client-Geo-Country', clonedRequest.headers.get('CF-IPCountry'));
      }
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

    // 3. PUBLIC WEBSITE ELEMENT ROUTING
    const defaultSiteUrl = `https://${ORIGIN_SERVER}${url.pathname}${url.search}`;
    return fetch(defaultSiteUrl, { 
      method: request.method, 
      headers: request.headers 
    });
  }
};
