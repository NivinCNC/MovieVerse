// app/api/proxy.m3u8/route.js
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

    try {
        const response = await axios.get(targetServer);

        const parsedUrl = new URL(targetServer);
        const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
        const basePath = parsedUrl.pathname.substring(0, parsedUrl.pathname.lastIndexOf('/'));

        masterM3U8 = response.data;
        
        // Rewrite URLs for `URI="..."` 
        // Rewrite URLs for `URI="..."`
        masterM3U8 = masterM3U8.replace(/URI="([^"]+)"/g, (match, p1) => {
            if (p1.startsWith('http://') || p1.startsWith('https://')) {
                return `URI="${p1}"`; // Absolute URLs remain unchanged
            }
            return `URI="/api/proxy?url=${baseUrl}${basePath}/${encodeURIComponent(p1)}"`;
        });

        masterM3U8 = masterM3U8.replace(/(https?:\/\/[^"]+\.m3u8\?[^"]*|[^"]+\.m3u8\?[^"]*)/gs, (match, p1) => {
            // If it's an absolute URL, return it unchanged
            if (p1.startsWith('http://') || p1.startsWith('https://')) {
                return p1;
            }
            const finalUrl = `/api/proxy?url=${baseUrl}${basePath}/${encodeURIComponent(p1)}`.replace(/\r?\n|\r/g, '');
            const finalUrlT = '\n' + finalUrl;
            return finalUrlT.replace(/#(?!.*#)/, '\n#');
        });
        console.log('masterM3U8:', masterM3U8);
        // Return the processed m3u8 content with the proper headers
        return new Response(masterM3U8, {
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
