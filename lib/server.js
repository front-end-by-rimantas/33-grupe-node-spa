import http from 'http';
import { file } from './file.js';
import { utils } from './utils.js';
import { StringDecoder } from 'string_decoder';


const server = {};

const [htmlErr, HTML] = await file.read('pages', 'index.html');

server.httpServer = http.createServer((req, res) => {
    const baseURL = `http${req.socket.encrypted ? 's' : ''}://${req.headers.host}`;
    const parsedURL = new URL(req.url, baseURL);
    const httpMethod = req.method.toLowerCase();
    const trimmedPath = parsedURL.pathname.replace(/^\/+|\/+$/g, '');
    const headers = req.headers;

    const textFileExtensions = ['css', 'js', 'txt', 'svg', 'webmanifest'];
    const binaryFileExtensions = ['eot', 'ttf', 'woff', 'woff2', 'otf', 'png', 'jpg', 'ico'];
    const fileExtension = utils.fileExtension(trimmedPath);

    const isTextFile = textFileExtensions.includes(fileExtension);
    const isBinaryFile = binaryFileExtensions.includes(fileExtension);
    const isAPI = trimmedPath.split('/')[0] === 'api';
    const isPage = !isTextFile && !isBinaryFile && !isAPI;

    const MIMES = {
        html: 'text/html',
        css: 'text/css',
        js: 'text/javascript',
        txt: 'text/plaint',
        svg: 'image/svg+xml',
        png: 'image/png',
        jpg: 'image/jpeg',
        ico: 'image/x-icon',
        woff2: 'font/woff2',
        woff: 'font/woff',
        ttf: 'font/ttf',
        otf: 'font/otf',
        eot: 'application/vnd.ms-fontobject',
        webmanifest: 'application/manifest+json',
        pdf: 'application/pdf',
        json: 'application/json',
    };

    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    })

    req.on('end', async () => {
        buffer += decoder.end();
        const payload = buffer === '' ? '' : JSON.parse(buffer);
        console.log(payload);

        let responseContent = '';

        if (isTextFile) {
            const [err, content] = await file.readPublic(trimmedPath);
            if (err) {
                responseContent = 'ERROR: problema bandant gauti norima faila';
                res.writeHead(404);
            } else {
                responseContent = content;
                res.writeHead(200, {
                    'Content-Type': MIMES[fileExtension],
                });
            }
        }

        if (isBinaryFile) {
            const [err, content] = await file.readBinaryPublic(trimmedPath);
            if (err) {
                responseContent = 'ERROR: problema bandant gauti norima faila';
                res.writeHead(404);
            } else {
                responseContent = content;
                res.writeHead(200, {
                    'Content-Type': MIMES[fileExtension],
                });
            }
        }

        if (isAPI) {
            const apiTarget = trimmedPath.split('/')[1];

            console.log(httpMethod, '->', trimmedPath);

            if (apiTarget === 'account') {
                responseContent = {
                    status: 'OK',
                    num: 1,
                    msg: 'Tau pavyko sukurti account',
                };
            }

            if (apiTarget === 'show') {
                responseContent = {
                    status: 'OK',
                    num: 2,
                    msg: 'Tau pavyko sukurti show',
                };
            }

            if (apiTarget === 'book') {
                responseContent = {
                    status: 'OK',
                    num: 3,
                    msg: 'Tau pavyko sukurti book',
                };
            }

            responseContent = JSON.stringify(responseContent);

            res.writeHead(200, {
                'Content-Type': MIMES['json'],
            });
        }

        if (isPage) {
            responseContent = HTML;
            res.writeHead(200, {
                'Content-Type': MIMES['html'],
            });
        }

        res.end(responseContent);
    })
});

server.API = {};

server.init = () => {
    const PORT = 3018;
    server.httpServer.listen(PORT, () => {
        console.log(`Tavo serveris sukasi ant http://localhost:${PORT}`);
    });
}

export { server };