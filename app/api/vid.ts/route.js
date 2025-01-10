
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
        const response = await fetch(targetServer);
    
        if (!response.ok) {
          return new Response(JSON.stringify({ error: `Failed to fetch VOD: ${response.statusText}` }), { status: response.status });
        }
        return response;
      } catch (error) {
        console.error('Error proxying VOD:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
      }
}