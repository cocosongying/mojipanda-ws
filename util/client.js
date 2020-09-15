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
            let type = data[0];
            let content = data[1];
            switch (type) {
                case 1:
                    // create join play leave
                    break;
            
                default:
                    break;
            }
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
