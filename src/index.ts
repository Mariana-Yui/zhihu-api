import Koa = require('koa');
import koaBody = require('koa-body');
import jsonError = require('koa-json-error');
import mongoose = require('mongoose');
import path = require('path');
import koaStatic = require('koa-static');
import router = require('./router/index');
const parameter = require('koa-parameter');
const { address } = require('./config');
const app = new Koa();

(async options => {
    try {
        console.log(address);
        await mongoose.connect(address, options);
        console.log('Connect Mongodb successfully!');
    } catch (err) {
        console.error(err);
    }
})({
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(jsonError({
    postFormat: (err, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? rest : { stack, ...rest }
}));
app.use(koaStatic(path.join(__dirname, '../public')));
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '../public/upload'),
        keepExtensions: true,
    },
}));
app.use(parameter(app));
router(app);


app.listen(3000, () => console.log('server is running at port 3000'));