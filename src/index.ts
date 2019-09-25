import Koa = require('koa');
import koaBody = require('koa-body');
import jsonError = require('koa-json-error');
import mongoose = require('mongoose');
import router = require('./router/index');
const parameter = require('koa-parameter');
const { address } = require('./config');
const app = new Koa();

(async options => {
    try {
        await mongoose.connect(address, options);
        console.log('Connect Mongodb successfully!');
    } catch (err) {
        console.error(err);
    }
})({ useNewUrlParser: true });

app.use(jsonError({
    postFormat: (err, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}));
app.use(koaBody());
app.use(parameter(app));
router(app);


app.listen(3000, () => console.log('server is running at port 3000'));