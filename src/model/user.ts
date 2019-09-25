import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    __v: { type: Number, select: false },
    username: { type: String, required: true },
    password: { type: String, required: true, select: false }
});

export = model('User', userSchema);