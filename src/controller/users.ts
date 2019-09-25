class UsersController {
    private static readonly db = ['李雷', '韩梅梅'];
    public async find(ctx: any) {
        ctx.body = '这是用户列表';
    }
    public async findId(ctx: any) {
        if (ctx.params.id * 1 > UsersController.db.length) {
            ctx.throw(424, "array out of range");
        }
        ctx.body = `用户id为${ctx.params.id}`;        
    }
    public async create(ctx: any) {
        ctx.verifyParams({
            name: 'string',
            age: { type: 'int', require: false }
        });
        ctx.body = ctx.request.body;
    }
    public async update(ctx: any) {
        if (ctx.params.id * 1 > UsersController.db.length) {
            ctx.throw(424, "array out of range");
        }
        ctx.verifyParams({
            name: 'string',
            age: { type: 'int', require: false }
        });
        ctx.body = `更新用户id为${ctx.params.id}`;        
    }
    public async delete(ctx: any) {
        if (ctx.params.id * 1 > UsersController.db.length) {
            ctx.throw(424, "array out of range");
        }
        ctx.body = `删除用户id为${ctx.params.id}`;
    }
}

export = new UsersController();