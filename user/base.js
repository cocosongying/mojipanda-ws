const CmdType = require('../const/cmdType');
const RPS = require('../scene/rps');

class BaseUser {
    constructor(params) {
        this.id = params.id;
        this.name = params.name;
        this.client = params.client;
    }
    dealData(data) {
        //
        let type = data[0];
        let content = data[1];
        switch (type) {
            case CmdType.RPS:
                if (!this.rps) {
                    let params = {
                        user: this,
                    }
                    this.rps = new RPS(params);
                }
                this.rps.dealData(content);
                break;

            default:
                break;
        }
    }
    sendData(data) {
        if (this.client) {
            this.client.sendData(data);
        }
    }
}

module.exports = BaseUser;
