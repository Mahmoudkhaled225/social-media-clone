import mongoose from "mongoose";
const replySchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'text required'],
        minlength: [1, 'Too short comment text it should be at least 1 character'],
        maxlength: [32, 'Too long comment text it should be at most 32 character'],
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        required: [true, "commentId required"],
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
    replyBefore:{
        default:null,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply",
    },
    replyAfter:{
        default:null,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Reply",
    },
    // replies: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Reply",
    // }],
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

const replyModel = mongoose.models.Reply || mongoose.model("Reply",replySchema)

export default replyModel
