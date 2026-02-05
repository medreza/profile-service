const mongoose = require('mongoose');
const { MBTI, ENNEAGRAM, ZODIAC } = require('../constants/personality');

const commentSchema = new mongoose.Schema({
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
    mbti: {
        type: String,
        enum: [...MBTI, null]
    },
    enneagram: {
        type: String,
        enum: [...ENNEAGRAM, null]
    },
    zodiac: {
        type: String,
        enum: [...ZODIAC, null]
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

// Virtual for like count
commentSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

module.exports = mongoose.model('Comment', commentSchema);
