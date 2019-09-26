import jsonwebtoken = require('jsonwebtoken');
import User = require('../model/user');
const { secret } = require('../config');

class UsersController {
    public async find(ctx: any) {
        ctx.body = await User.find();
    }
    public async findById(ctx: any) {
        const { field } = ctx.query;
        const selectStr = field
            && (field as string).split(';').filter(f => f).map(f => `+${f} `).join('')
            || '';
        const user = await User.findById(ctx.params.id).select(selectStr);
        if (!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user;
    }
    public async create(ctx: any) {
        ctx.verifyParams({
            username: 'string',
            password: 'string'
        });
        const { username } = ctx.request.body;
        const isRepeatedUser = await User.findOne({ username });
        if (isRepeatedUser) { ctx.throw(409, '用户名已存在'); }
        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }
    public async update(ctx: any) {
        ctx.verifyParams({
            username: { type: 'string', required: false },
            password: { type: 'string', required: false },
            avatar_url: { type: 'string', required: false },
            gender: { type: 'string', required: false },
            headline: { type: 'string', required: false },
            locations: { type: 'array', itemType: 'string', required: false },
            business: { type: 'string', required: false },
            employments: { type: 'array', itemType: 'object', required: false },
            educations: { type: 'array', itemType: 'object', required: false },
        });
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user;
    }
    public async delete(ctx: any) {
        const user = await User.findByIdAndDelete(ctx.params.id, ctx.request.body);
        if (!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user;
    }
    public async login(ctx: any) {
        ctx.verifyParams({
            username: { type: 'string', required: true },
            password: { type: 'string', required: true }
        });
        const user = await User.findOne(ctx.request.body);
        if (!user) { ctx.throw(404, '用户不存在'); }
        const { _id, username } = user as any;
        const token = jsonwebtoken.sign({ _id, username }, secret, { 'expiresIn': '1d' });
        ctx.body = { token };
    }
}

export = new UsersController();
