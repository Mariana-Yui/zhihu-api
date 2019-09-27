import jsonwebtoken = require('jsonwebtoken');
import jwt = require('koa-jwt');
import User = require('../model/user');
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
    console.log(ctx.state.user, ctx.params.id);
    if (ctx.state.user._id !== ctx.params.id) {
        ctx.throw(401, '没有权限');
    }
    await next();
}

exports.auth2 = jwt({ secret });

exports.checkExist = async (ctx: any, next: any) => {
    const user = await User.findById(ctx.params.id);
    if (!user) { ctx.throw(404); }
    await next();
}