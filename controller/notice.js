const ApiReturn = require('../common/util/api_return');
const UserManager = require('../util/manager').UserManager;

class Notice {
    // 广播消息
    async broadcast(params) {
        // 消息类型
        // 通知栏消息
        // 聊天室消息
        // 发送方 1. 系统通知 2. 公众号
        // 接收方 所有人
        // 处理入参
        let {templateType, msgType, sender, contentType, content} = params;
        // 处理消息
        let msg = `[${templateType},[${msgType},${sender},${contentType}],[${content}]]`;
        for (let key of Object.keys(UserManager.all)) {
            let user = UserManager.get(key);
            if (user) {
                user.send(msg);
                console.log(`send msg ${msg} success`);
            }
        }
        // 发送消息
        // 返回结果
        return ApiReturn.success();
    }

    // 发送给指定人
    async direct(params) {
        // 发送方 1. 系统通知 2. 公众号
        // 接收方 ids
        return ApiReturn.success();
    }
}

module.exports = new Notice();