const fs = require('fs');
const path = require('path');
const util = require('util')
const context = require('../context');
const File = require('./file');
const LogLevel = {
    Error: 1,
    Warn: 2,
    Info: 3,
    Debug: 4
};

var filePrefix = "";
var logtime;
var writeStream;
var isTTY = true;

function createWriteStream() {
    writeStream = fs.createWriteStream(`${filePrefix}${logtime}.log`, { flags: "a" });
}
function appendZero(num) {
    if (num < 10) {
        return "0" + "" + num;
    } else {
        return num;
    }
}
function getLevelName(level) {
    switch (level) {
        case LogLevel.Error:
            return "ERROE";
        case LogLevel.Warn:
            return "WARN";
        case LogLevel.Info:
            return "INFO";
        case LogLevel.Debug:
            return "DEBUG";
    }
}
function write(level, filename, ...message) {
    if (Log.globalLevel < level) {
        return;
    }
    let date = new Date();
    let today = date.getFullYear() + "-" + appendZero(date.getMonth() + 1) + "-" + appendZero(date.getDate());
    if (today != logtime) {
        logtime = today;
        if (writeStream != null) {
            writeStream.end();
            writeStream = null;
        }
    }
    let prefix = getLevelName(level);
    prefix += ` [${logtime} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}] ${filename} `;
    if (isTTY) {
        if (process.stdout.isTTY) {
            try {
                console.info(prefix, util.format(...message));
                return;
            } catch (error) {
                isTTY = false;
            }
        } else {
            isTTY = false;
        }
    }
    if (writeStream == null) {
        createWriteStream();
    }
    writeStream.write(prefix);
    writeStream.write(util.format(...message));
    if (context.get("reqId")) {
        writeStream.write(" " + context.get("reqId"));
    }
    writeStream.write("\n");
}

function Log(filename) {
    if (this === global) {
        return new Log(filename);
    } else {
        this.filename = path.relative(path.dirname(__dirname), filename);
    }
}

Log.globalLevel = LogLevel.Debug;
Log.LogLevel = LogLevel;
Log.prototype = {
    error: function (...message) {
        write(LogLevel.Error, this.filename, ...message);
    },
    warn: function (...message) {
        write(LogLevel.Warn, this.filename, ...message);
    },
    info: function (...message) {
        write(LogLevel.Info, this.filename, ...message);
    },
    debug: function (...message) {
        write(LogLevel.Debug, this.filename, ...message);
    }
}
Log.setName = function (dirname, level) {
    File.mkdirp(dirname);
    let name = path.basename(dirname);
    filePrefix = path.resolve(dirname, name);
    Log.globalLevel = level;
}

module.exports = Log;
