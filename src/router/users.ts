import Router = require('koa-router');
const { find, findById, create, update, delete: del, login, listFollowing, follow, listFollower, unfollow } = require('../controller/users');
const { auth, auth2, isOwner, checkExist } = require('../middleware/auth');

const usersRouter = new Router({ prefix: '/users' });

usersRouter.get('/', find);
usersRouter.get('/:id', findById);
usersRouter.post('/', create);
usersRouter.patch('/:id', auth2, isOwner, update);  // 局部修改, 具有幂等性
usersRouter.delete('/:id', auth2, isOwner, del);
usersRouter.post('/login', login);
usersRouter.get('/:id/follower', listFollower);
usersRouter.get('/:id/following', listFollowing);
usersRouter.put('/following/:id', auth2, checkExist, follow);
usersRouter.delete('/following/:id', auth2, checkExist, unfollow);

export = usersRouter;