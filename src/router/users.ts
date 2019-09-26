import Router = require('koa-router');
import jsonwebtoken = require('jsonwebtoken');
const { find, findById, create, update, delete: del, login } = require('../controller/users');
const { secret } = require('../config');
const usersRouter = new Router({ prefix: '/users' });

const auth = async (ctx: any, next: any) => {
    try {
        const { token = '' } = ctx.request.headers;
        const user = jsonwebtoken.verify(token.replace('Bearer ', ''), secret);
        ctx.state.user = user;
        await next();
    } catch (err) {
        ctx.throw(401, '没有权限');
    }
}
const isSelf = async (ctx: any, next: any) => {
    if (ctx.state.user._id !== ctx.params.id) {
        ctx.throw(401, '没有权限');
    }
    await next();
}

usersRouter.get('/', find);
usersRouter.get('/:id', findById);
usersRouter.post('/', create);
usersRouter.patch('/:id', auth, isSelf, update);  // 局部修改, 具有幂等性
usersRouter.delete('/:id', auth, isSelf, del);
usersRouter.post('/login', login);

export = usersRouter;