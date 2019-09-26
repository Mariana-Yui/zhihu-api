import Router = require('koa-router');
const { find, findById, create, update, delete: del, login } = require('../controller/users');
const { auth, isSelf } = require('../middleware/auth');

const usersRouter = new Router({ prefix: '/users' });

usersRouter.get('/', find);
usersRouter.get('/:id', findById);
usersRouter.post('/', create);
usersRouter.patch('/:id', auth, isSelf, update);  // 局部修改, 具有幂等性
usersRouter.delete('/:id', auth, isSelf, del);
usersRouter.post('/login', login);

export = usersRouter;