import mongoose from "mongoose"
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'title required'],
        minlength: [1, 'Too short user name'],
        maxlength: [32, 'Too long user name'],
    },
    description: {
        type: String,
        required: [true, 'description required'],
        minlength: [1, 'Too short user name'],
        maxlength: [32, 'Too long user name'],
    },
    category: [{
    type:String,
    required: [true, 'categoryIDs required'],
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    dislikes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
    }],

    //feature that could be add as in stackOverFlow
//    likesDislikesRatio: {
//        type: Number,
//        default: 0,
//    },

}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

const postModel = mongoose.models.Post || mongoose.model("Post",postSchema)

export default postModel