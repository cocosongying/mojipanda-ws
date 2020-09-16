const User = require('../user/base');

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
            if (!this.user) {
                let params = {
                    id: 1,
                    name: 't',
                    client: this,
                }
                this.user = new User(params);
            }
            this.user.dealData(data)
        } catch (error) {
            return;
        }
        //
        console.log(`[DEAL] Received: ${data}`);
    }
    sendData(data) {
        console.log(data);
        this.ws.send(data);
    }
}

module.exports = Client;
