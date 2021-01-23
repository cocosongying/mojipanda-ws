const Url = require('url');
const WebSocketServer = require('ws').Server;
const Client = require('./util/client');
const UserManager = require('./util/manager').UserManager;
const config = require('./config');

const wss = new WebSocketServer({
    host: config.host,
    port: config.wsport
});

wss.on('connection', (ws, req) => {
    console.log(`[SERVER] connection()`);
    // console.log(req);
    let params = Url.parse(req.url, true).query;
    console.log(params);
    console.log(params.token);
    let u = UserManager.get(params.token);
    if (u) {
        u.close();
    }
    ws.socketId = params.token;
    UserManager.set(params.token, ws);
    // wss.clients.forEach(client => {
    //     if (client.socketId == params.token) {
    //         client.close();
    //         client = null;
    //     }
    //     console.log(1);
    // });
    if (!this.client) {
        this.client = new Client(ws, params);
    }
    ws.on('message', (message) => {
        try {
            if (!this.client) {
                this.client = new Client(ws, params);
            }
            this.client.dealData(message);
        } catch (error) {
            console.log(error);
        }
        console.log(wss.clients.size);
        console.log(`[SERVER] Received: ${message}`);
        ws.send('hello');
    });
    ws.on('close', () => {
        console.log('close');
        try {
            if (this.client) {
                if (this.client.ws === UserManager.get(params.token)) {
                    UserManager.del(params.token);
                }
                this.client.closed();
            }
            this.client = null;
        } catch (error) {
            console.log(error);
        }
    });
    ws.on('error', () => {
        console.log('error');
        try {
            if (this.client) {
                if (this.client.ws === UserManager.get(params.token)) {
                    console.log('del key');
                    UserManager.del(params.token);
                }
                this.client.closed();
            }
            this.client = null;
        } catch (error) {
            console.log(error);
        }
    })
});
console.log(`mojipanda ws websocket is starting at port 5001`);

const init = require('./common/servlet');
const app = init(require('./router'));
app.listen(config.apiport, config.host, () => {
    console.log(`mojipanda ws api is starting at port 5002`);
});
