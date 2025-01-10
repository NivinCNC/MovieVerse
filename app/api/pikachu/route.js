
export async function GET(request) {
    const url = new URL(request.url);
    const query = url.searchParams;
    const targetServer = query.get('url');
    if (!targetServer) {
        return new Response(
            JSON.stringify({ error: 'URL parameter is required' }),
            { status: 400 }
        );
    }
    try {
        const response = await fetch(targetServer,{
            headers: {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "Accept-Encoding": "gzip, deflate",
                "Accept-Language": "en-US,en;q=0.9",
                "Connection": "keep-alive",
                "Host": "vanoe325lpp.com",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-User": "?1",
                "Upgrade-Insecure-Requests": "1",
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Mobile/15E148 Safari/604.1",
                "X-Requested-With": "com.offshore.pikachu",
            }
        });
        response.headers.set("Accept-Encoding", "gzip, deflate");
    
        if (!response.ok) {
          return new Response(JSON.stringify({ error: `Failed to fetch VOD: ${response.statusText}` }), { status: response.status });
        }
        return response;
      } catch (error) {
        console.error('Error proxying VOD:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
      }
}