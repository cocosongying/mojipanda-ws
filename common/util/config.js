const fs = require('fs');

// 合并配置文件，confVal 优先级最高
function merge(initVal, confVal) {
    for (let key in initVal) {
        if (confVal[key] == undefined) {
            confVal[key] = initVal[key];
        } else if (typeof initVal[key] === "object") {
            confVal[key] = merge(initVal[key], confVal[key]);
        }
    }
    return confVal;
}

// 合并默认值和外部配置文件值
// mode: 
//     0 - 没有外部配置时使用默认值
//     1 - 必须使用外部配置，没有就退出程序
function init(initVal, conf, mode) {
    try {
        let confVal = require(conf);
        let value = merge(initVal, confVal);
        return value;
    } catch (error) {
        if (mode === 1) {
            console.log(`get config ${conf} failed, exit.`)
            process.exit(1);
        } else {
            return initVal;
        }
    }
}

module.exports = init;
