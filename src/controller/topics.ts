import Topic = require('../model/Topics');

class TopicsController {
    async find(ctx: any) {
        const topics = await Topic.find();
        ctx.body = topics;
    }
    async findById(ctx: any) {
        const { field = '' } = ctx.query;
        const selectStr = field.split(';').filter((f: any) => f).map((f: any) => `+${f} `).join('');
        const topic = await Topic.findById(ctx.params.id).select(selectStr);
        if (!topic) { ctx.throw(404); }
        ctx.body = topic;
    }
    async create(ctx: any) {
        ctx.verifyParams({
            name: { type: 'string', required: true },
            avatar_url: { type: 'string', required: false },
            introduction: { type: 'string', required: false },
        });
        const topic = await new Topic(ctx.request.body).save();
        ctx.body = topic;
    }
    async update(ctx: any) {
        ctx.verifyParams({
            name: { type: 'string', required: false },
            avatar_url: { type: 'string', required: false },
            introduction: { type: 'string', required: false },
        });
        const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if (!topic) { ctx.throw(404, '话题不存在'); }
        ctx.body = topic;
    }
}

export = new TopicsController();