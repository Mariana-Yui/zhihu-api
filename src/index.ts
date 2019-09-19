import Koa = require('koa');
import bodyParser = require('koa-bodyparser');
import router = require('./router/index');
const app = new Koa();

app.use(bodyParser());
router(app);


app.listen(3000, () => console.log('server is running at port 3000'));