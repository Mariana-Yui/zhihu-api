import Router = require('koa-router');
const { find, findById, create, update } = require('../controller/topics');
const { auth2 } = require('../middleware/auth');
const topicsRouter = new Router({prefix: '/topics'});

topicsRouter.get('/', find);
topicsRouter.get('/:id', findById);
topicsRouter.post('/create', auth2, create);
topicsRouter.patch('/update', auth2, update);

export = topicsRouter;