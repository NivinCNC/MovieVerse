// app/api/proxy/route.js
import axios from 'axios';
import fetch from 'node-fetch';
const { Response } = fetch;

const USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';


export async function GET(request) {
    const url = new URL(request.url);
    const query = url.searchParams;
    const videoUrl = query.get('url');
    const referer = query.get('referer') || '';

    if (!videoUrl) {
        return new Response('Missing url parameter', { status: 400 });
    }

    try {
        const response = await axios.get(videoUrl, {
            headers: {
                'User-Agent': USER_AGENT,
                'Referer': referer,
            },
            responseType: 'stream',
        });

        return new Response(response.data, {
            headers: {
                'Content-Type': 'application/vnd.apple.mpegurl',
            },
        });
    } catch (error) {
        return new Response('Error fetching the video', { status: 500 });
    }
}