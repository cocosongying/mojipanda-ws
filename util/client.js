class Client {
    constructor(ws, params) {
        this.ws = ws;
        this.params = params;
    }
    deal(data) {
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
}

module.exports = Client;