// ======================================================================
// ADFLOW ISOLATED EDGE PROXY - LOOP-FREE COMPATIBILITY BUILD
// Save Location: Your GitHub Repository -> _worker.js
// ======================================================================

const NETWORKS = {
  'adsterra': 'celerycribbanish.com',     
  'adcash': 'acscdn.com',                 
  'cybertron': 'cybertronads.com',
  
  // HilltopAds Multi-Domain Proxy Matrix Exception Mapping
  'hilltopads': 'untimely-hello.com',
  'hilltopads-pop': 'physicaldad.com'
};

// 🛰️ PHYSICAL BACKEND HOSTING SERVER ORIGIN ENDPOINT
// This breaks the infinite loop by forcing whitelisted traffic directly to your host
const ORIGIN_SERVER = '://infinityfree.com'; 

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/'); 
    const folder = pathParts[1] ? pathParts[1].toLowerCase() : ''; 

    // 🛑 HARDENED SECURITY BYPASS: Routes paths straight to the origin server safely
    if (
      url.pathname.includes('/adflow') || 
      url.pathname.includes('mutation.php') || 
      url.pathname.includes('config-delivery.php') ||
      url.searchParams.has('api_auth')
    ) {
      const targetOriginUrl = `https://${ORIGIN_SERVER}${url.pathname}${url.search}`;
      return fetch(targetOriginUrl, { method: request.method, headers: request.headers, body: request.method === 'POST' ? await request.text() : null });
    }

    // 🎯 IF THE PATH MATCHES AN AD PROXY FOLDER, RUN THE DE-CLOAK MATRIX
    if (folder && NETWORKS[folder]) {
      const realDomain = NETWORKS[folder];
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

    // Pass standard public website pages safely to the physical host
    const defaultSiteUrl = `https://${ORIGIN_SERVER}${url.pathname}${url.search}`;
    return fetch(defaultSiteUrl, { method: request.method, headers: request.headers });
  }
};
