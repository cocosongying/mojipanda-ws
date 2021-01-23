const fs = require('fs');
const path = require("path")

class File {
    static mkdirp(filepath) {
        if (fs.existsSync(filepath)) {
            return;
        }
        let dirname = path.dirname(filepath);
        if (!fs.existsSync(dirname)) {
            this.mkdirp(dirname);
        }
        fs.mkdirSync(filepath);
    }
    static fileExt(name) {
        let ext = name.split('.');
        return ext[ext.length -1];
    }
}

module.exports = File;