import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'UserName required'],
        minlength: [2, 'Too short user name'],
        maxlength: [32, 'Too long user name'],

    },
    email: {
        type: String,
        required: [true, 'email required'],
        unique: [true, 'email must be unique'],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'password required'],
        minlength: [2, 'Too short password'],
    },
    age: {
        type: Number,
        min: [18, "minimum age is 18"],
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    profile_pic: {
        type: String
    }
}, {
    timestamps: true
})

const userModel = mongoose.models.User || mongoose.model("User",userSchema)

export default userModel