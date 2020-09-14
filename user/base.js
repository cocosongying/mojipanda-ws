class BaseUser {
    constructor(params) {
        this.id = params.id;
        this.name = params.name;
        this.client = params.client;
    }
    dealData() {
        //
    }
    sendData(data) {
        if (this.client) {
            this.client.sendData(data);
        }
    }
}

module.exports = BaseUser;
