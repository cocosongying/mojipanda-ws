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
    keys() {
        return Object.keys(this.all);
    }
}

module.exports = {
    RSPManager: new Collection(),
    UserManager: new Collection(),
}