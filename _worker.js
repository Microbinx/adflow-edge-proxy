// ======================================================================
// ADFLOW ISOLATED EDGE PROXY - CLEAN REVERSE PROXY SHIELD BUNDLE
// Save Location: Your GitHub Repository -> _worker.js
// STATUS: 100% Compliant. Anti-AdBlock Node Routing Matrix.
// ======================================================================

const THIRD_PARTY_NETWORKS = {
  'ad-assets-alpha': 'celerycribbanish.com',     
  'ad-assets-beta': 'acscdn.com',                 
  'ad-assets-gamma': 'cybertronads.com',
  'ad-assets-delta': 'untimely-hello.com',
  'ad-assets-epsilon': 'physicaldad.com'
};

const ORIGIN_SERVER = 'microbim.name.ng'; 

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathParts = url.pathname.split('/').filter(Boolean); 
    const routingFolder = pathParts[0] ? pathParts[0].toLowerCase() : ''; 
    const hasActiveBody = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method);

    // 1. SECURE ADMINISTRATIVE INFRASTRUCTURE PASS-THROUGH
    // Ensures backend controls, form submits, and log writing bypass proxy structures entirely
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
        body: hasActiveBody ? request.body : null 
      });
    }

    // 2. ANTI-ADBLOCK STREAMING DE-CLOAK MATRIX
    // Intercepts local trusted directory routes and forwards them to ad network servers
    if (routingFolder && THIRD_PARTY_NETWORKS[routingFolder]) {
      const targetRealDomain = THIRD_PARTY_NETWORKS[routingFolder];
      const cleanPath = '/' + pathParts.slice(1).join('/');
      const destinationNetworkUrl = `https://${targetRealDomain}${cleanPath}${url.search}`;

      // Build clean headers tracking parameters matching real user telemetry
      const cleanHeaders = new Headers(request.headers);
      cleanHeaders.set('Accept-Encoding', 'identity');
      cleanHeaders.set('Host', targetRealDomain);
      
      // Preserve the user's authentic IP footprint cleanly so ad networks track genuine value
      // This is crucial for passing account validation checks
      const clearUserIp = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For');
      if (clearUserIp) {
        cleanHeaders.set('X-Forwarded-For', clearUserIp);
        cleanHeaders.set('X-Real-IP', clearUserIp);
      }

      const networkResponse = await fetch(destinationNetworkUrl, {
        method: request.method,
        headers: cleanHeaders,
        body: hasActiveBody ? request.body.clone() : null
      });

      // DYNAMIC CODE RE-WRITER MATRIX
      // Scans third-party script texts on the fly and masks network links to avoid ad blocker triggers
      const contentType = networkResponse.headers.get('Content-Type') || '';
      if (contentType.includes('javascript') || contentType.includes('html')) {
        let scriptPayloadText = await networkResponse.text();
        
        // Dynamically replace blacklisted tracking links with local lookalikes on your domain
        const linkMaskRegex = new RegExp(targetRealDomain, 'g');
        scriptPayloadText = scriptPayloadText.replace(linkMaskRegex, `${url.hostname}/${routingFolder}`);
        
        const optimizedOutputHeaders = new Headers(networkResponse.headers);
        optimizedOutputHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
        optimizedOutputHeaders.delete('Content-Length');
        
        return new Response(scriptPayloadText, { 
          status: networkResponse.status,
          headers: optimizedOutputHeaders
        });
      }
      return networkResponse;
    }

    // 3. PUBLIC WEBSITE MAIN FLOW ROUTING
    // Forwards normal webpage files to the core public hosting server seamlessly
    const nativeDestinationUrl = `https://${ORIGIN_SERVER}${url.pathname}${url.search}`;
    const nativeSiteHeaders = new Headers(request.headers);
    nativeSiteHeaders.set('Host', ORIGIN_SERVER);

    return fetch(nativeDestinationUrl, { 
      method: request.method, 
      headers: nativeSiteHeaders,
      body: hasActiveBody ? request.body : null
    });
  }
};
