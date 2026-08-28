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
    const folder = pathParts[1]; // Grabs the subfolder 'adsterra', 'hilltopads', etc.

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
        return new Response(text, { headers: { 'Content-Type': contentType, 'Cache-Control': 'no-store' } });
      }
      return response;
    }
    return fetch(request);
  }
};
