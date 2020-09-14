class Client {
    constructor(ws, params) {
        this.ws = ws;
        this.params = params;
    }
    dealData(data) {
        if (data.length == 0) {
            return;
        }
        try {
            data = JSON.parse(data);
        } catch (error) {
            return;
        }
        //
        console.log(`[DEAL] Received: ${data}`);
    }
    sendData(data) {
        this.ws.send(data);
    }
}

module.exports = Client;
