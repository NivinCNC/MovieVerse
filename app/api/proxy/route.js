import axios from 'axios';

export async function GET(request) {
    const url = new URL(request.url);
    const query = url.searchParams;
    const targetServer = query.get('url');
    let masterM3U8;
    if (!targetServer) {
        return new Response(
            JSON.stringify({ error: 'URL parameter is required' }),
            { status: 400 }
        );
    }
    try {
        const response = await axios.get(targetServer);
        masterM3U8 = response.data;
        masterM3U8 = masterM3U8.replace(/https:\/\/[^\n#]+/g, (url) => {
            const encodedUrl = url;
            return `/api/vid.ts?url=${encodeURIComponent(url)}`;
          });     
        // Return the processed m3u8 content with the proper headers
        return new Response(masterM3U8, {
            status: 200,
            headers: response.headers,
        });
    } catch (error) {
        console.error('Error fetching master.m3u8:', error.message);
        return new Response('Error fetching master.m3u8 file', { status: 500 });
    }
}