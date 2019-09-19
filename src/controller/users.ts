class UsersController {
    public async find(ctx: any) {
        ctx.body = '这是用户列表';
    }
    public async findId(ctx: any) {
        ctx.body = `用户id为${ctx.params.id}`;        
    }
    public async create(ctx: any) {
        ctx.body = ctx.request.body;
    }
    public async update(ctx: any) {
        ctx.body = `更新用户id${ctx.params.id}`;        
    }
    public async delete(ctx: any) {
        ctx.body = `删除用户id${ctx.params.id}`;
    }
}

export = new UsersController();