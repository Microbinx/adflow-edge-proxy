// Deploy as a Single Cloudflare Worker mapped to wildcard domain: https://yourdomain.com*
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
    const folder = pathParts[1];

    if (folder && NETWORKS[folder]) {
      const realDomain = NETWORKS[folder];
      const newPath = url.pathname.replace(`/${folder}/`, '');
      const realTargetUrl = `https://${realDomain}/${newPath}${url.search}`;

      const incomingHeaders = new Headers(request.headers);
      incomingHeaders.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') || '');
      incomingHeaders.set('Host', realDomain);

      const response = await fetch(realTargetUrl, {
        method: request.method,
        headers: incomingHeaders,
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

    // Default structural pass-through to InfinityFree backend server origin
    return fetch(request);
  }
};
