class HomeController {
    public async index(ctx: any) {
        ctx.body = '这是主页'
    }
}

export = new HomeController();