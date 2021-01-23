class Collection {
    constructor() {
        this.all = {};
    }
    set(key, data) {
        this.all[key] = data;
    }
    get(key) {
        return this.all[key];
    }
    del(key) {
        delete this.all[key];
    }
}

module.exports = {
    RSPManager: new Collection(),
    UserManager: new Collection(),
}