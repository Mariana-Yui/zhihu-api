import Koa = require('koa');
import Router = require('koa-router');

const app = new Koa();
const router = new Router();
const usersRouter = new Router({ prefix: '/users'});

const auth = async (ctx: { url: string; throw: (arg0: number) => void; }, next: () => void) => {
    if (ctx.url !== '/users') {
        ctx.throw(401);
    } else {
        await next();
    }
}

router.get('/', ctx => {
    ctx.body = '这是主页';
});
usersRouter.get('/', auth, ctx => {
    ctx.body = '这是用户列表';
});
usersRouter.post('/', auth, ctx => {
    ctx.body = '更新用户列表';
});
usersRouter.get('/:id', ctx => {
    ctx.body = `用户id为${ctx.params.id}`;
});

app.use(router.routes());
app.use(usersRouter.routes());
// app.use(usersRouter.allowedMethods());


app.listen(7000);