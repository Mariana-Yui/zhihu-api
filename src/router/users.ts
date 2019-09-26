import Router = require('koa-router');
const { find, findById, create, update, delete: del, login } = require('../controller/users');
const { auth, auth2, isOwner } = require('../middleware/auth');

const usersRouter = new Router({ prefix: '/users' });

usersRouter.get('/', find);
usersRouter.get('/:id', findById);
usersRouter.post('/', create);
usersRouter.patch('/:id', auth2, isOwner, update);  // 局部修改, 具有幂等性
usersRouter.delete('/:id', auth2, isOwner, del);
usersRouter.post('/login', login);

export = usersRouter;