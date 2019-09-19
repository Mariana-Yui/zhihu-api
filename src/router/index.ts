import fs = require('fs');

export = (app: any) => {
    const files = fs.readdirSync(__dirname);
    files.forEach(file => {
        if (!(/index/.test(file))) {
            const router = require(`./${file}`);
            app.use(router.routes()).use(router.allowedMethods());
        }
    });
}