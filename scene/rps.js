class RPSPlay {
    constructor(params) {
        //
        this.clients = {};
    }
    addClient(client) {
        //
        this.clients[client.id] = client;
    }
    getClient(id) {
        //
        return this.clients[id];
    }
    dealData(data) {
        //
    }
    broadcast(data, skip, to) {
        if (!to) {
            to = this.clients;
        }
        for (let i in to) {
            if (to[i] != skip) {
                to[i].sendData(data);
            }
        }
    }
}

module.exports = RPSPlay;
