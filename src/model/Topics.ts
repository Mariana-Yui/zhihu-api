import { Schema, model } from 'mongoose';

const TopicSchema = new Schema({
    __v: { type: Number, select: false },
    name: { type: String, require: true },
    avatar_url: { type: String },
    introduction: { type: String, select: false }
});

export = model('Topic', TopicSchema);