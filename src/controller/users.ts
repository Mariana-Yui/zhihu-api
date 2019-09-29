import jsonwebtoken = require('jsonwebtoken');
import User = require('../model/user');
import Topic = require('../model/Topics');
const { secret } = require('../config');

class UsersController {
    static readonly diploma: Array<string> =
        ['高中及以下', '大专', '本科', '硕士', '博士'];
    public async find(ctx: any) {
        let { perPage = 10, page = 1 } = ctx.query;
        page = Math.max(page * 1, 1) - 1;
        perPage = Math.max(perPage * 1, 1);
        const users = await User
            .find({ name: ctx.query.q })
            .limit(perPage).skip(perPage * page);
        ctx.body = users;
    }
    public async findById(ctx: any) {
        const { field = '' } = ctx.query;
        const selectStr = field.split(';').filter((f: any) => f).map((f: any) => `+${f} `).join('');
        const user = await User
            .findById(ctx.params.id)
            .select(selectStr)
            .populate('following location business');
        if (!user) { ctx.throw(404, '用户不存在'); }
        ctx.body = user;
    }
    public async create(ctx: any) {
        ctx.verifyParams({
            username: 'string',
            password: 'string',
            avatar_url: { type: 'string', required: false },
            gender: { type: 'string', required: false },
            headline: { type: 'string', required: false },
            locations: { type: 'array', itemType: 'string', required: false },
            business: { type: 'string', required: false },
            employments: { type: 'array', itemType: 'object', required: false },
            educations: { type: 'array', itemType: 'object', required: false },
        });
        await UsersController.nameToId(ctx);
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
        await UsersController.nameToId(ctx);
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
    /** 粉丝列表 */
    public async listFollower(ctx: any) {
        const users: any = await User.find({ following: ctx.params.id });
        ctx.body = users;
    }
    /** 关注列表 */
    public async listFollowing(ctx: any) {
        const users: any = await User.findById(ctx.params.id).select('+following').populate('following');
        if (!users) { ctx.throw(404); }
        const { following } = users;
        ctx.body = { following };
    }
    /** 关注用户 */
    public async follow(ctx: any) {
        const owner: any = await User.findById(ctx.state.user._id).select('+following');
        if (!owner.following.map((id: { toString: () => void; }) => id.toString()).includes(ctx.params.id)) {
            owner.following.push(ctx.params.id);
            owner.save();
        }
        ctx.status = 204;
    }
    /** 取消关注 */
    public async unfollow(ctx: any) {
        const owner: any = await User.findById(ctx.state.user._id).select('+following');
        const index = owner.foolowing.map((id: { toString: () => void }) => id.toString()).indexOf(ctx.params.id);
        if (owner.following.map((id: { toString: () => void; }) => id.toString()).includes(ctx.params.id)) {
            owner.following.splice(index, 1);
            owner.save();
        }
        ctx.status = 204;
    }
    private static async findTopicId(ctx: any, name: string) {
        const user = await Topic.findOne({ name });
        if (!user) { ctx.throw(404, `找不到${name}`); }
        return (user as any)._id.toString();
    }
    private static async nameToId(ctx: any) {
        for (const key in ctx.request.body) {
            if (key === 'locations') {
                const arr = await Promise.all((ctx.request.body[key] as Array<string>).map(name => UsersController.findTopicId(ctx, name)));
                ctx.request.body[key] = arr;
            } else if (key === 'business') {
                ctx.request.body[key] = await UsersController.findTopicId(ctx, ctx.request.body[key]);
            } else if (key === 'employments') {
                for (const obj of ctx.request.body[key] as Array<any>) {
                    for (const key1 in obj) {
                        obj[key1] = await UsersController.findTopicId(ctx, obj[key1]);
                    }
                }
            } else if (key === 'educations') {
                for (const obj of ctx.request.body[key] as Array<any>) {
                    for (const key1 in obj) {
                        if (/_year$/.test(key1)) continue;
                        if (key1 === 'diploma') {
                            obj[key1] = UsersController.diploma[obj[key1]];
                        }
                        obj[key1] = await UsersController.findTopicId(ctx, obj[key1]);
                    }
                }
            }
        }
    }
}

export = new UsersController();
