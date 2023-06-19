import commentModel from "../../DB/models/commentModel.js";
import postModel from "../../DB/models/postModel.js";
import AppError from "../../utils/ErrorHandling/AppError.js";
import replyModel from "../../DB/models/replyModel.js";

/**
 * @desc      Create a new comment
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message and the created comment
 * @route   POST /pinterest/v1/comment/addcomment/:postID
 * @access  Private User Only

 */
export const addComment = async (req, res ,next) => {
    const userID = req.user._id;
    const {postID} = req.params;
    const {text} = req.body;
    let post = await postModel.findOne({_id:postID});
    (!post) && next(new AppError("now such a post to comment on it", 400));
    const comment = await commentModel({text,post:postID,user:userID});
    await comment.save();
    post.comments.push(comment._id);
    await post.save();
    res.status(200).json({msg:"done comment is added",comment});
    (!comment) &&next(new AppError("fail to add comment try again", 400));
};


/**
 * @desc      update comment's text
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message and the created comment
 * @route   PATCH /pinterest/v1/comment/updatecomment/:postID
 * @access  Private User Only

 */
export const updateCommentText = async (req, res ,next) => {
    const userID = req.user._id;
    const {postID} = req.params;
    const {newText,commentId} = req.body;
    let post = await postModel.findOne({_id:postID});
    (!post) && next(new AppError("now such a post to comment on it", 400));
    let comment = await commentModel.findOne({_id:commentId,user:userID});
    (!comment) && next(new AppError("now such a comment to update it", 400));
    comment.text = newText;
    await comment.save() &&  res.status(200).json({msg:"done comment is updated",comment});
    next(new AppError("fail to update comment try again", 400));
};


/**
 * @desc      delete comment
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message and the created comment
 * @route   DELETE /pinterest/v1/comment/deletecomment/:postID/:commentId
 * @access  Private User Only

 */
export const deleteComment = async (req, res ,next) => {
    const userID = req.user._id;
    const {postID, commentId} = req.params;
    const comment = await commentModel.findOne({_id:commentId,user:userID});
    (!comment) && next(new AppError("now such a comment to delete it", 400));
    const post = await postModel.findById(postID);
    (!post) && next(new AppError("now such a post to delete comment on it", 400));
    if(comment.firstReplyOnComment){
        let reply = await replyModel.findById(comment.firstReplyOnComment);
        while(reply.replyAfter !== null) {
            let temp = reply.replyAfter;
            await reply.deleteOne();
            reply = await replyModel.findById(temp)
        }
        await reply.deleteOne();
   }
    post.comments.pop(comment._id);
    await post.save();
    await comment.deleteOne();
    res.status(200).json({msg:"done comment is deleted"});
};


/**
 * @desc      get all comment on post
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message and the created comment
 * @route   GET /pinterest/v1/comment/getallcomments/:postID
 * @access  Private User Only

 */
export const getAllCommentsOnPost = async (req, res ,next) => {
    const {postID} = req.params;
    const post = await postModel.findOne({_id:postID});
    (!post) && next(new AppError("now such a post to get its comments", 400));
    let arr = [];
    for(let i = 0; i < post.comments.length; i++)
        arr.push(await commentModel.findOne({_id:post.comments[i]}));

    (arr.length !==0 )?
        res.status(200).json({msg:`done comments are fetched and the number of comment is ${arr.length}`,comments:arr})
        :next(new AppError("no comments on this post", 400));

    next(new AppError("fail to get comments try again", 400));
};