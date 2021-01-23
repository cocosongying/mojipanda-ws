const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const BodyParser = require('koa-bodyparser');
const KoaBody = require('koa-body');
const { v4: uuidv4 } = require('uuid');
const log = require('./util/log')(__filename);
const context = require('./context');
const StatusCode = require('../const/statusCode');

// 对本次请求生成唯一的 requestId
async function deal(ctx, next) {
    let reqId = uuidv4();
    ctx.request.__mojiRequestId__ = reqId;
    ctx.req.__mojiRequestId__ = reqId;
    await context.runPromise(next);
}

// 初始化接口方法
function init(methods) {
    let app = new Koa();
    app.use(cors());
    app.use(deal);
    let router = new Router();
    app.use(BodyParser({ jsonLimit: '2mb' }));
    methods.forEach(method => {
        if (typeof method === "function") {
            app.use(method);
            return;
        }
        let servlets = method[0];
        let path = method[1] || "";
        servlets.forEach(servlet => {
            servlet[0] = path + servlet[0];
            getpost(router, ...servlet);
        });
    });
    app.use(router.routes()).use(router.allowedMethods());
    return app;
}

// get 请求的接口
function get(method, options) {
    return async function (ctx, next) {
        let request = ctx.request;
        request.params = ctx.params;
        let response = ctx.response;
        let requestId = request.__mojiRequestId__;
        try {
            let param = request.query;
            param.mojiToken = request.mojiToken;
            log.info("%s %s GETDATA %s", requestId, request.path, JSON.stringify(param));
            if (options) {
                let { roles } = options;
                if (!checkRole(roles, param.mojiToken, response, requestId, ctx)) {
                    return;
                }
            }
            context.set('path', request.path);
            context.set('reqId', requestId);
            param.__mojiRequestId__ = requestId;
            let res = await method(param, request, response, ctx, next);
            res = json2String(res, requestId);
            log.info('%s %s RESULTDATA %s', requestId, request.path, res)
            if (res == null) {
                return;
            }
            if (param.cb) {
                response.body = param.cb + "(" + res + ")";
            } else {
                ctx.set('Content-Type', 'application/json');
                response.body = res;
            }
        } catch (error) {
            dealErr(ctx, response, error, requestId);
        }
    }
}

// post 请求的接口
function post(method, options) {
    return async function (ctx, next) {
        let request = ctx.request;
        request.params = ctx.params;
        let response = ctx.response;
        let requestId = request.__mojiRequestId__;
        try {
            let param = ctx.req.body || request.body || {};
            param.mojiToken = request.mojiToken;
            log.info("%s %s POSTDATA %s", requestId, request.path, JSON.stringify(param));
            if (options) {
                let { roles } = options;
                if (!checkRole(roles, param.mojiToken, response, requestId, ctx)) {
                    return;
                }
            }
            context.set('path', request.path);
            context.set('reqId', requestId);
            param.__mojiRequestId__ = requestId;
            let res = await method(param, request, response, ctx, next);
            res = json2String(res, requestId);
            if (res == null) {
                return;
            }
            log.info("%s %s RESULTDATA %s", requestId, request.path, res);
            ctx.set('Content-Type', 'application/json');
            response.body = res;
        } catch (error) {
            dealErr(ctx, response, error, requestId);
        }
    }
}

// 给接口分配 get 和 post 请求
function getpost(router, path, method, options) {
    if (!options) {
        router.get(path, get(method));
        router.post(path, post(method));
        return;
    } else if (typeof options == "object" && options.upload == true) {
        router.post(path, post(method));
    } else {
        router.get(path, get(method));
        router.post(path, post(method, options));
    }
}

// 将请求添加 reqId, reqTime, 并将结果转换成字符串
function json2String(result, requestId) {
    if (typeof result != "object" || result == null) {
        return result;
    }
    result.reqId = requestId;
    result.reqTime = Date.now();
    return JSON.stringify(result);
}

// 检查角色权限
function checkRole(roles, token, response, requestId, ctx) {
    let role = token.role
    if (!roles.some(r => r == role)) {
        log.warn(`%s ${role} is not allowed`, requestId);
        ctx.set('Content-Type', 'application/json');
        let result = {
            code: StatusCode.ROLE_ERR,
            requestId,
            responseTime: Date.now()
        }
        response.body = json2String(result, requestId);
        return false;
    }
    return true;
}

// 处理异常的返回
function dealErr(ctx, response, error, requestId) {
    log.error("%s error with stack info '%s'", requestId, error.stack)
    let result = {
        code: StatusCode.INTERNAL_ERR,
        error: error.message || error.stack,
        requestId,
        requestTime: Date.now()
    };
    ctx.set('Content-Type', 'application/json');
    response.body = json2String(result, requestId);
}

module.exports = init;