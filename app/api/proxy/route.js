import axios from 'axios';

export async function GET(request) {
    const url = new URL(request.url);
    const query = url.searchParams;
    const targetServer = query.get('url');
    let masterM3U8;
    console.log('targetServer:', targetServer);
    if (!targetServer) {
        return new Response(
            JSON.stringify({ error: 'URL parameter is required' }),
            { status: 400 }
        );
    }
    console.log('targetServer:', targetServer);
    try {
        const response = await axios.get(targetServer,
            {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                    'Referer': 'https://embedwish.com/',
                    'Accept': '*/*',
                    'Connection': 'keep-alive',
                    'Origin': 'https://embedwish.com',
                }
            }
        );
     
        console.log('masterM3U8:', response.data);
        // Return the processed m3u8 content with the proper headers
        return new Response(response.data, {
            status: 200,
            headers: {
                'Content-Type': 'application/vnd.apple.mpegurl',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache',
            },
        });
    } catch (error) {
        console.error('Error fetching master.m3u8:', error.message);
        return new Response('Error fetching master.m3u8 file', { status: 500 });
    }
}