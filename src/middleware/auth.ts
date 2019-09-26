import jsonwebtoken = require('jsonwebtoken');
import jwt = require('koa-jwt');
const { secret } = require('../config');

exports.auth = async (ctx: any, next: any) => {
    try {
        const { authorization = '' } = ctx.request.headers;
        const user = jsonwebtoken.verify(authorization.replace('Bearer ', ''), secret);
        ctx.state.user = user;
        await next();
    } catch (err) {
        ctx.throw(401, '没有权限');
    }
}
exports.isOwner = async (ctx: any, next: any) => {
    if (ctx.state.user._id !== ctx.params.id) {
        ctx.throw(401, '没有权限');
    }
    await next();
}
exports.auth2 = jwt({ secret });