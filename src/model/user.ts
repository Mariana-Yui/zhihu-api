import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    __v: { type: Number, select: false },
    username: { type: String, required: true },
    password: { type: String, required: true, select: false },
    avatar_url: { type: String },
    gender: { type: String, enum: ['male', 'female'], default: 'male' },
    headline: { type: String },
    locations: { type: [{ type: String }] },
    business: { type: String },
    employments: {
        type: [{
            company: { type: String },
            job: { type: String },
        }]
    },
    educations: [{
        school: { type: String },
        major: { type: String },
        diploma: { type: Number, enum: [1, 2, 3, 4, 5] },
        entrance_year: { type: Number },
        graduate_year: { type: Number },
    }]
});

export = model('User', userSchema);