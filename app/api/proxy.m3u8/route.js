// app/api/proxy.m3u8/route.js
import axios from 'axios';

const USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';

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
        const response = await axios.get(targetServer, {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'application/vnd.apple.mpegurl',
            },
        });

        const parsedUrl = new URL(targetServer);
        const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
        const basePath = parsedUrl.pathname.substring(0, parsedUrl.pathname.lastIndexOf('/'));

        masterM3U8 = response.data;

        // Rewrite URLs for `URI="..."` 
        masterM3U8 = masterM3U8.replace(/URI="([^"]+)"/g, (match, p1) => {
            if (p1.startsWith('http://') || p1.startsWith('https://')) {
                return `URI="${p1}"`; // Absolute URLs remain unchanged
            }
            return `URI="${baseUrl}${basePath}/${p1}"`;
        });

        // Rewrite any other URLs in m3u8 format
        masterM3U8 = masterM3U8.replace(/(https?:\/\/[^"]+\.m3u8\?[^"]*|[^"]+\.m3u8\?[^"]*)/gs, (match, p1) => {
            // If it's an absolute URL, return it unchanged
            if (p1.startsWith('http://') || p1.startsWith('https://')) {
                return p1;
            }
            const finalUrl = `${baseUrl}${basePath}/${p1}`.replace(/\r?\n|\r/g, '');
            const finalUrlT = '\n' + finalUrl;
            return finalUrlT.replace(/#(?!.*#)/, '\n#');
        });

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
