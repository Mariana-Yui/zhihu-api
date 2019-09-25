import User = require('../model/user');

class UsersController {
    public async find(ctx: any) {
        ctx.body = User.find();
    }
    public async findById(ctx: any) {
        const user = await User.findById(ctx.params.id);
        if (!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user;
    }
    public async create(ctx: any) {
        ctx.verifyParams({
            username: 'string',
            password: 'string'
        });
        const { name } = ctx.request.body;
        const isRepeatedUser = await User.findOne({ name });
        if (isRepeatedUser) { ctx.throw(409, '用户名已存在'); }
        const user = await new User(ctx.request.body);
        ctx.body = user;
    }
    public async update(ctx: any) {
        ctx.verifyParams({
            username: { type: 'string', required: false },
            password: { type: 'string', required: false }
        });
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user;
    }
    public async delete(ctx: any) {
        const user = await User.findByIdAndDelete(ctx.params.id, ctx.request.body);
        ctx.body = user;
    }
}

export = new UsersController();