import http from 'http';
import { file } from './file.js';
import { utils } from './utils.js';

const server = {};

server.httpServer = http.createServer((req, res) => {
    const baseURL = `http${req.socket.encrypted ? 's' : ''}://${req.headers.host}`;
    const parsedURL = new URL(req.url, baseURL);
    const httpMethod = req.method.toLowerCase();
    const trimmedPath = parsedURL.pathname.replace(/^\/+|\/+$/g, '');
    const headers = req.headers;

    const textFileExtensions = ['css', 'js', 'txt', 'svg'];
    const binaryFileExtensions = ['ico', 'jpg', 'png'];
    const fileExtension = utils.fileExtension(trimmedPath);

    const isTextFile = textFileExtensions.includes(fileExtension);
    const isBinaryFile = binaryFileExtensions.includes(fileExtension);
    const isAPI = trimmedPath.split('/')[0] === 'api';
    const isPage = !isTextFile && !isBinaryFile && !isAPI;

    req.on('data', () => {
        console.log('- klientas atsiunte duomenu');
    })

    req.on('end', async () => {
        let responseContent = '';

        if (isTextFile) {
            const [err, content] = await file.readPublic(trimmedPath);
            if (err) {
                responseContent = 'ERROR: problema bandant gauti norima faila';
            } else {
                responseContent = content;
            }
        }

        if (isBinaryFile) {
            responseContent = 'BINARY FAILAS';
        }

        if (isAPI) {
            responseContent = 'API ATSAKYMAS';
        }

        if (isPage) {
            const [err, content] = await file.read('pages', 'index.html');
            if (err) {
                responseContent = 'ERROR: nepavyko gauti HTML';
            } else {
                responseContent = content;
            }
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