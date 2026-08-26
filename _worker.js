// ======================================================================
// ADFLOW UNIVERSAL EDGE NETWORK STREAM PROXY PIPELINE (CORRECTED BUILD)
// Deploy as a Single Cloudflare Worker mapped to your wildcard domain: ://yourdomain.com*
// ======================================================================

const NETWORKS = {
  'adsterra': 'celerycribbanish.com',     
  'hilltopads': 'untimely-hello.com',    
  'adcash': 'acscdn.com',                 
  'cybertron': 'cybertronads.com'         
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/'); 
    const folder = pathParts[1]; // Grabs the first subdirectory layer keyword

    // CRITICAL CONDITION: If the path targets your registered ad folders, execute proxy routing
    if (folder && NETWORKS[folder]) {
      const realDomain = NETWORKS[folder];
      const newPath = url.pathname.replace(`/${folder}/`, '');
      const realTargetUrl = `https://${realDomain}/${newPath}${url.search}`;

      const response = await fetch(realTargetUrl, {
        method: request.method,
        headers: { 
          'User-Agent': request.headers.get('User-Agent'), 
          'Accept': request.headers.get('Accept'),
          'X-Forwarded-For': request.headers.get('CF-Connecting-IP') 
        },
        body: request.method === 'POST' ? await request.text() : null
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

    // SAFE PASSTHROUGH ROUTE: If it's a regular file (like admin.php or news.php),
    // clone the exact original browser request headers so InfinityFree renders pages instead of downloading them!
    return fetch(request, {
      headers: request.headers
    });
  }
};
