import userModel from "../../DB/models/userModel.js";
import sendEmail from "../../services/sendMail.js";
import AppError from "../../utils/ErrorHandling/AppError.js";
import {hashPassword} from "../../utils/hashing/hashPassword.js";
import {createToken} from "../../utils/token/createToken.js";
import {decodedToken} from "../../utils/token/decodedToken.js";
import {CompareHashedPassword} from "../../utils/hashing/compareHashedPassword.js";
import {nanoid} from "nanoid";
import {alter} from "../../utils/token/alter.js";
import fs from "fs";
import pagination from "../../services/pagination.js";
import postModel from "../../DB/models/postModel.js";
import commentModel from "../../DB/models/commentModel.js";

/**
 * @desc      user register
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   POST /pinterest/v1/user/signup
 * @access  Public

 */
export const signUp = async (req, res,next) => {
    const {email} = req.body;
    (!req.file) && next(new AppError("please select you pictures", 404));
    const hashedPassword = hashPassword(req.body.password);
    const user = userModel({name:req.body.name, email, password:hashedPassword, age:req.body.age, profile_pic: req.file.path});
    const token = createToken({user});
    const confirmationLink = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/user/confirmEmail/${token}`;
    await sendEmail({
        to: user.email,
        message: `<a href=${confirmationLink}>Click to confirm</a>`,
        subject: "Confirmation Password"
    });
    (sendEmail) && res.status(201).json({message: "check your inbox and click link to activate "})
    //next(new AppError("sign up fail",400));
};

/**
 * @desc      confirm mail to finish user registeration
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   GET /pinterest/v1/user/confirmEmail/:token
 * @access  Public

 */
export const confirmEmail = async (req, res, next) => {
    const {token} = req.params;
    const decode = decodedToken(token, process.env.TOKEN_SIGNATURE);

    (!decode?.user) && next(new AppError("in-valid decoding token", 400));

    decode.user.confirmed = true;
    const savedUser = await userModel({...decode.user}).save();
    return res.status(200).json({message: "Confirmation success , please try to login", savedUser});

};

/**
 * @desc      user login
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   POST /pinterest/v1/user/login
 * @access  Private Users and Admins

 */
export const logIn = async (req, res) => {
    const{email,password} = req.body;
    const checkUser = await userModel.findOne({email,confirmed:true});
    (!checkUser) && res.json({ message: "in-valid data1" });
    const isPasswordValid = CompareHashedPassword({
        payload: password,
        referenceData: checkUser.password
    });
    (!isPasswordValid) && res.json({ message: "in-valid data2" });
    const token = createToken({id: checkUser._id})
    res.json({ message: "login success", checkUser ,token});
};

/**
 * @desc      update profile Img
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   PATCH /pinterest/v1/user/login
 * @access  Private Users and Admins

 */
export const uploadProfilePicture = async (req, res, next) => {
    (!req.file) && next(new AppError("please select you pictures", 404));
    const { _id } = req.user;
    const user = await userModel.findById(_id);
    if(user && !user.profile_pic) {
    await fs.unlinkSync(user.profile_pic);
    user.profile_pic = req.file.path;
    await user.save();
    res.status(200).json({ message: "Done" ,user});
    }
    (!user) && next(new AppError("please logIn to update your pic", 404));
};

/**
 * @desc      user forget password
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   GET /pinterest/v1/user/forgetpass/:email
 * @access  Private Users and Admins

 */
export const forgetPassword = async (req, res, next) => {
    const {email} = req.params;
    //if you want to use postman
    //now i dont use just click the link generate new pass by nanoid

    const user = await userModel.findOne({email, confirmed: true});
    const pass= nanoid(10);
    const hashedPassword = hashPassword(pass);
    await userModel.findOneAndUpdate({email, confirmed: true},{password:hashedPassword});
    const resetPassword = `${req.protocol}://${req.headers.host}${process.env.BASE_URL}/user/resetpass/${email}`;
    await sendEmail({
        to: user.email,
        message: `<a href=${resetPassword}>Click to confirm that will generate password from 10 digits and the new password is ${pass}</a>`,
        subject: "Resetting Password"
    });

    (sendEmail) && res.status(200).json({message: "check your inbox and click link to change password  "})

    //new Error("operation failed try again");

};

/**
 * @desc      user reset password
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   GET /pinterest/v1/user/resetpass/:email
 * @access  Private Users and Admins

 */
export const resetPassword = async (req, res) => {
    const {email} = req.params;
    res.status(200).json({message: "password changed"});

    new Error("operation failed try again");

};

/**
 * @desc      user change your password
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   PATCH /pinterest/v1/user/changepass
 * @access  Private Users and Admins

 */
export const changePassword = async (req, res) => {
    const {password,confirmationPassword} = req.body;
    const {token} = req.headers;
    const decoded = decodedToken(token);
    const hashedPassword = hashPassword(password);
    const checkUser = await userModel.findOneAndUpdate({_id:decoded.id,confirmed:true},{password:hashedPassword},{new:true});
    (!checkUser)&&res.json({ message: "email is not registered sign up plz" });
    res.json({ message: "password changed", checkUser });
};

/**
 * @desc      delete user from database
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   DELETE /pinterest/v1/user/delete
 * @access  Private Users and Admins

 */
export const deleteUser = async (req, res) => {
    const { _id } = req.user;
    const user = await userModel.findByIdAndDelete(_id);
    (user)&& await fs.unlinkSync(user.profile_pic);
    (user)&& res.json({ message: "you are deleted Done" });
    res.json({ message: "fail" });
};

/**
 * @desc      deactivate user account but it still in database
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   DELETE /pinterest/v1/user/delete
 * @access  Private Users and Admins

 */
export const softDeleteUser = async (req, res) => {
    const { _id } = req.user;
    const user = await userModel.findByIdAndUpdate(_id, {isDeleted: true});
    (user)&& res.json({ message: "Done" });
    res.json({ message: "fail" });
};

/**
 * @desc      user change your NAme and Age
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   PATCH /pinterest/v1/user/update
 * @access  Private Users and Admins

 */
export const updateUserNameAndAge = async (req, res) => {
    const {name,age} = req.body;
    const { _id } = req.user;
    const user = await userModel.findByIdAndUpdate(_id, {name,age});
    (user)&& res.json({ message: "Done" });
    res.json({ message: "fail" });
};

export const logOut = async (req, res) => {
    let { token } = req.headers;
    const decoded = decodedToken(token, process.env.TOKEN_SIGNATURE);
    (!decoded||!decoded.id)&& res.json({ message: "decoded fail" });
    req.headers.token = alter(token);
    res.status(200).json({msg:"you logged out and our token is changed"});
};

/**
 * @desc      get all users
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   GET /pinterest/v1/user/getallusers
 * @access  Private Users

 */
export const getAllUsers = async (req, res,next) => {
    const {page,size} = req.body;
    const {limit,skip} = pagination(page,size);
    const users = await userModel.find({ $and: [
        {isDeleted:false },
        {confirmed:true},
        {role:"user"}
    ]}).limit(limit).skip(skip).sort({name:1});
    (users.length === 0) && next(new AppError("no users found",404));
    res.status(200).json({msg:"done",
    data: {
        users,
        total:users.length
    },meta: {
        skip,
        limit
        }
    });
};

export const likePost = async (req, res, next) => {
    const userId = req.user._id;
    const {postId} = req.params;
    const post = await postModel.findOneAndUpdate({_id:postId,dislikes:{$nin:userId},likes:{$nin:userId}},
        { $addToSet:
                {likes:userId}
        },
        {new:true});
    if(post) {
        post.likesDislikesRatio = post.likes.length - post.dislikes.length;
        //await post.save();
        return res.status(200).json({msg: "done like had been added", post});
    }
    (await postModel.findOne({_id:postId,dislikes:{$in:userId}})) && next(new AppError("you already disliked this post so you cant like",400));
    (!post) && next(new AppError("you already liked this post ",400));
};

export const dislikePost = async (req, res, next) => {
    const userId = req.user._id;
    const {postId} = req.params;
    const post = await postModel.findOneAndUpdate({_id: postId, dislikes: {$nin: userId}, likes: {$nin: userId}},
        {
            $addToSet:
                {dislikes: userId}
        },
        {new: true});
    if (post){
        //post.likesDislikesRatio = post.likes.length - post.dislikes.length;
        //await post.save();
        return res.status(200).json({msg: "done dislike had been added", post});
    }
    (await postModel.findOne({_id:postId,likes:{$in:userId}})) && next(new AppError("you already liked this post so you cant disliked",400));
    (!post) && next(new AppError("you already disliked this post",400));
};

export const removeLikePost = async (req, res, next) => {
    const userId = req.user._id;
    const {postId} = req.params;
    const post = await postModel.findOneAndUpdate({_id:postId,likes:{$in:userId}},
        { $pull:
                {likes:userId}
        },
        {new:true});
    if (post){
        //post.likesDislikesRatio = post.likes.length - post.dislikes.length;
        //await post.save();
        return res.status(200).json({msg:"done like had been removed",post});
    }
    (!post) && next(new AppError("you dont like this post to remove invalid operation",400));

};

export const removeDislikePost = async (req, res, next) => {
    const userId = req.user._id;
    const {postId} = req.params;
    const post = await postModel.findOneAndUpdate({_id: postId, dislikes: {$in: userId}},
        {
            $pull:
                {dislikes: userId}
        },
        {new: true});
    if(post){
        //post.likesDislikesRatio = post.likes.length - post.dislikes.length;
        //await post.save();
        return res.status(200).json({msg: "done dislike had been removed", post});
    }
    (!post) && next(new AppError("you dont dislike this post to remove invalid operation",400));
};

export const likeComment = async (req, res, next) => {
    const userId = req.user._id;
    const {commentId} = req.params;
    const comment = await commentModel.findOneAndUpdate({_id:commentId,dislikes:{$nin:userId},likes:{$nin:userId}},
        { $addToSet:
                {likes:userId}
        },
        {new:true});
    if(comment)
        return res.status(200).json({msg:"done like had been added on comment",post: comment});
    (await commentModel.findOne({_id:commentId,dislikes:{$in:userId}})) && next(new AppError("you already disliked this comment so you cant like",400));
    (!comment) && next(new AppError("you already liked this comment ",400));
};

export const dislikeComment = async (req, res, next) => {
    const userId = req.user._id;
    const {commentId} = req.params;
    const comment =await commentModel.findOneAndUpdate({_id:commentId,dislikes:{$nin:userId},likes:{$nin:userId}},
        { $addToSet:
                {dislikes:userId}
        },
        {new:true});
    if(comment)
        return res.status(200).json({msg:"done dislike had been added to comment",comment});
    (await commentModel.findOne({_id:commentId,likes:{$in:userId}})) && next(new AppError("you already liked this comment so you cant disliked",400));
    (!comment) && next(new AppError("you already disliked this comment",400));
};

export const removeLikeComment = async (req, res, next) => {
    const userId = req.user._id;
    const {commentId} = req.params;
    const comment = await commentModel.findOneAndUpdate({_id:commentId,likes:{$in:userId}},
        { $pull:
                {likes:userId}
        },
        {new:true});
    (comment) && res.status(200).json({msg:"done like had been removed",comment});
    (!comment) && next(new AppError("you dont like this post to remove invalid operation",400));
};

export const removeDislikeComment = async (req, res, next) => {
    const userId = req.user._id;
    const {commentId} = req.params;
    const comment = await commentModel.findOneAndUpdate({_id:commentId,dislikes:{$in:userId}},
        { $pull:
                {dislikes:userId}
        },
        {new:true});
    (comment) && res.status(200).json({msg:"done dislike had been removed",comment});
    (!comment) && next(new AppError("you dont dislike this post to remove invalid operation",400));
};