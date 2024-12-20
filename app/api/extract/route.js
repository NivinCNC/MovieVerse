// app/api/extract/route.js
import axios from 'axios';

const USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
const MAIN_URL = 'https://embedwish.com';

const getEmbedUrl = (url) => {
    if (url.includes('/f/')) {
        const videoId = url.split('/f/')[1];
        return `${MAIN_URL}/${videoId}`;
    }
    return url;
};

const extractM3u8 = (script) => {
    const regex = /file:\s*\"(.*?m3u8.*?)\"/;
    const match = script.match(regex);
    return match ? match[1] : null;
};

const extractVtt = (script) => {
    const regex = /https?:\/\/[^'"\s]+\.vtt/;
    const match = script.match(regex);
    return match ? match[0] : null;
};


function EvalDecode(source) {
    global._eval = global.eval;
  
    global.eval = (_code) => {
        global.eval = global._eval;
      return _code;
    };
  
    return global._eval(source);
  }

export async function GET(request) {
    const url = new URL(request.url);
    const query = url.searchParams;
    const videoUrl = query.get('url');
    const referer = query.get('referer') || '';

    if (!videoUrl) {
        return new Response(
            JSON.stringify({ error: 'URL parameter is required' }),
            { status: 400 }
        );
    }

    try {
        const headers = {
            Accept: '*/*',
            Connection: 'keep-alive',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'cross-site',
            Origin: `${MAIN_URL}/`,
            'User-Agent': USER_AGENT,
        };

        const embedUrl = getEmbedUrl(videoUrl);
        const response = await axios.get(embedUrl, {
            headers: { ...headers, Referer: referer },
        });
        const pageContent = response.data;

        const regex = /(eval\s*\(function\(p,a,c,k,e,.*?)<\/script>/gs;
        const matches = [...pageContent.matchAll(regex)];
        let unpackedCode = '';
        matches.forEach((match) => {
            const obfuscatedCode = match[1];
            const unpacked = EvalDecode(obfuscatedCode);
            unpackedCode += unpacked;
        });

        const m3u8 = extractM3u8(unpackedCode);
        const vtt = extractVtt(unpackedCode);

        if (m3u8) {
            return new Response(JSON.stringify({ m3u8, vtt: vtt || null }), {
                status: 200,
            });
        }

        return new Response(JSON.stringify({ error: 'No playable sources found' }), {
            status: 404,
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: 'An error occurred while processing the request' }), {
            status: 500,
        });
    }
}
