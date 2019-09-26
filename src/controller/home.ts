import path = require('path');

class HomeController {
    public async index(ctx: any) {
        ctx.body = `
            <form action="/upload" enctype="multipart/form-data" method="POST">
                <label for="file">上传图片</label>
                <input type="file" id="file" />
                <input type="submit" value="提交" />
            </form>
        `;
    }
    public async upload(ctx: any) {
        const file = ctx.request.files && ctx.request.files[""];
        const basename = path.basename(file.path);
        ctx.body = { url: `${ctx.origin}/upload/${basename}` };
    }
}

export = new HomeController();