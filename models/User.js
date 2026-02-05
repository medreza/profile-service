const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }
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

module.exports = mongoose.model('User', userSchema);
