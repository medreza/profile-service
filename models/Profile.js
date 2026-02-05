const mongoose = require('mongoose');
const { MBTI, ENNEAGRAM } = require('../constants/personality');

const profileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    mbti: {
        type: String,
        enum: MBTI
    },
    enneagram: {
        type: String,
        enum: ENNEAGRAM
    },
    variant: { type: String },
    tritype: { type: Number },
    socionics: { type: String },
    sloan: { type: String },
    psyche: { type: String },
    image: { type: String, default: 'https://soulverse.boo.world/images/1.png' }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

module.exports = mongoose.model('Profile', profileSchema);
