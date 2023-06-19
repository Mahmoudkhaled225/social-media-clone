import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'text required'],
        minlength: [1, 'Too short comment text it should be at least 1 character'],
        maxlength: [32, 'Too long comment text it should be at most 32 character'],
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: [true, 'PostId required'],

    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'UserId required'],

    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    firstReplyOnComment: {
        default: null,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply",
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

const commentModel = mongoose.models.Comment || mongoose.model("Comment",commentSchema)

export default commentModel
