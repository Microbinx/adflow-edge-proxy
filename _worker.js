// ======================================================================
// ADFLOW ISOLATED EDGE PROXY - STREAM-SAFE MUTATION BUILD
// Save Location: Your GitHub Repository -> _worker.js
// ======================================================================

const NETWORKS = {
  'adsterra': 'celerycribbanish.com',     
  'hilltopads': 'untimely-hello.com',    
  'adcash': 'acscdn.com',                 
  'cybertron': 'cybertronads.com'         
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/'); 
    const folder = pathParts[1] ? pathParts[1].toLowerCase() : ''; 

    // 🛑 AD-FOLDER BYPASS REINFORCED
    // If the traffic is heading to your admin console files, bypass the proxy blocks 
    // entirely and pass the request raw so mutation data frames never drop.
    if (url.pathname.includes('/adflow') || url.pathname.includes('mutation.php') || url.pathname.includes('config-delivery.php')) {
      return fetch(request);
    }

    // 🎯 IF THE PATH MATCHES AN AD PROXY FOLDER, RUN THE DE-CLOAK MATRIX
    if (folder && NETWORKS[folder]) {
      const realDomain = NETWORKS[folder];
      const newPath = url.pathname.replace(`/${folder}/`, '');
      const realTargetUrl = `https://${realDomain}/${newPath}${url.search}`;

      // Clone the request stream to prevent form data loss over the cloud proxy
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

    // Standard website passthrough
    return fetch(request);
  }
};
