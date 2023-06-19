import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category required'],
        minlength: [1, 'Too short user name it should be at least 1 character'],
        maxlength: [32, 'Too long user name it should be at most 32 character'],
        unique:true,
    },
    post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: [true, 'PostId required'],

    }]
}, {
    timestamps: true
})

const categoryModel = mongoose.models.Category || mongoose.model("Category",categorySchema)

export default categoryModel