import Router = require('koa-router');
const { find, findById, create, update, delete: del } = require('../controller/users');
const usersRouter = new Router({prefix: '/users'});

usersRouter.get('/', find);
usersRouter.get('/:id', findById);
usersRouter.post('/', create);
usersRouter.put('/:id', update);
usersRouter.delete('/:id', del);

export = usersRouter;