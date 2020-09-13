const Url = require('url');
const WebSocketServer = require('ws').Server;
const Client = require('./util/client');

const wss = new WebSocketServer({
    port: 5001
});

wss.on('connection', (ws, req) => {
    console.log(`[SERVER] connection()`);
    // console.log(req);
    let params = Url.parse(req.url, true).query;
    console.log(params);
    console.log(params.token);
    ws.socketId = params.token;
    wss.clients.forEach(client => {
        console.log(client.socketId);
    })
    ws.on('message', (message) => {
        try {
            if (!this.client) {
                this.client = new Client(ws, params);
            }
            this.client.deal(message);
        } catch (error) {
            console.log(error);
        }
        console.log(`[SERVER] Received: ${message}`);
        ws.send(`ECHO: ${message}`, (err) => {
            if (err) {
                console.log(`[SERVER] error: ${err}`);
            }
        });
    });
    ws.on('close', () => {
        console.log('close');
    });
    ws.on('error', () => {
        console.log('error');
    })
});
