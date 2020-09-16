const CmdType = require('../const/cmdType');
const RSPManager = require('../util/manager').RSPManager;

class RPSPlay {
    constructor(params) {
        this.user = params.user;
        this.players = {};
        this.actions = {};
    }
    addClient(user) {
        //
        this.players[user.id] = user;
    }
    getClient(id) {
        //
        return this.players[id];
    }
    dealData(data) {
        // create join play leave
        let rps;
        switch (data[0]) {
            case CmdType.RPSAction.CREATE:
                rps = RSPManager.get('123');
                if (!rps) {
                    RSPManager.set('123', this);
                    this.addClient(this.user);
                }
                this.user.sendData('123');
                break;
            case CmdType.RPSAction.JOIN:
                rps = RSPManager.get(data[1]);
                rps.addClient(this.user);
                rps.broadcast(`${this.user.id} join`);
                break;
            case CmdType.RPSAction.PLAY:
                rps = RSPManager.get(data[1]);
                rps.actions[this.user.id] = data[2];
                if (Object.keys(rps.actions).length == 2) {
                    rps.broadcast(JSON.stringify(rps.actions));
                }
                break;
            case CmdType.RPSAction.LEAVE:
                break;
            default:
                break;
        }
    }
    broadcast(data, skip, to) {
        if (!to) {
            to = this.players;
        }
        for (let i in to) {
            if (to[i] != skip) {
                to[i].sendData(data);
            }
        }
    }
}

module.exports = RPSPlay;
