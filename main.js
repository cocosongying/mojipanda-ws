const Koa = require('koa');
const Router = require('koa-router');
const Url = require('url');
const WebSocketServer = require('ws').Server;
const Client = require('./util/client');
const UserManager = require('./util/manager').UserManager;

const wss = new WebSocketServer({
    port: 5001
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
    // ws.socketId = params.token;
    // [type, content]
    ws.on('message', (message) => {
        try {
            if (!this.client) {
                this.client = new Client(ws, params);
            }
            this.client.dealData(message);
        } catch (error) {
            console.log(error);
        }
        console.log(`[SERVER] Received: ${message}`);
        ws.send('hello');
    });
    ws.on('close', () => {
        console.log('close');
        try {
            if (this.client) {
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
                this.client.closed();
            }
            this.client = null;
        } catch (error) {
            console.log(error);
        }
    })
});

const app = new Koa();
const router = new Router();
router.get('/send', ctx => {
    // wss.clients.forEach(client => {
    //     let data = '消息' + Date.now();
    //     client.send(`[1,"${data}"]`);
    // })
    let u = UserManager.get('1_1599579114772_uyo5hyptqwu1pc0scr');
    if (u) {
        let data = '消息' + Date.now();
        u.send(`[1,"${data}"]`);
    }
    ctx.body = 'OK';
});
app.use(router.routes());
app.listen(5002, 'localhost', () => {
    console.log(`mojipanda ws server is starting at port 5002`);
});
