import Router = require('koa-router');
const { index } = require('../controller/home');
const router = new Router();

router.get('/', index);

export = router;