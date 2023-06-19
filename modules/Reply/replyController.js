import commentModel from "../../DB/models/commentModel.js";
import replyModel from "../../DB/models/replyModel.js";
import AppError from "../../utils/ErrorHandling/AppError.js";


export const addFirstReplyOnComment = async (req, res,next) => {
    const {commentId} = req.params;
    const {replyText} = req.body;
    // const post = await postModel.findById(postId);
    const comment = await commentModel.findById(commentId);
    (!comment) && next(new AppError("no such a comment to add reply on it", 400));
    (comment.firstReplyOnComment !== null) && next(new AppError("this comment already has a reply", 400));
    const reply = await replyModel.create({text:replyText,comment:commentId,user:req.user._id});
    await comment.updateOne({firstReplyOnComment:reply._id});

    (!reply) && next(new AppError("fail to add reply try again", 400));
    res.status(201).json({msg:"done reply is added",reply});
};

export const addReplyOnReply = async (req, res, next) => {
    const {replyId} = req.params;
    const {replyText} = req.body;
    const existReply = await replyModel.findById(replyId);
    (!existReply) && next(new AppError("no such a reply to add reply on it", 400));
    const reply = await replyModel.create({text:replyText,comment:existReply.comment,user:req.user._id,replyBefore:replyId});
    await existReply.updateOne({replyAfter:reply._id,});
    (!reply) && next(new AppError("fail to add reply try again", 400));
    res.status(201).json({msg:"done reply is added",reply});
};

export const updateReplyText = async (req, res, next) => {
    const {replyId} = req.params;
    const {newText} = req.body;
    const reply = await replyModel.findOne({_id:replyId,user:req.user._id});
    (!reply) && next(new AppError("no such a reply to update it", 400));
    reply.text = newText;
    await reply.save();
    res.status(200).json({msg:"done reply is updated",reply});
}

export const deleteReply = async (req, res, next) => {
    const {commentId,replyId} = req.params;
    const comment = await commentModel.findOne({_id:commentId});
    const reply = await replyModel.findOne({_id:replyId,user:req.user._id});
    (!reply) && next(new AppError("no such a reply to delete it", 400));
    if(String(comment.firstReplyOnComment) === String(reply._id) && reply.replyBefore === null){
        let subReply = await replyModel.findById(reply.replyAfter);
        while(subReply.replyAfter !== null) {
            let temp = subReply.replyAfter;
            await subReply.deleteOne();
            subReply = await replyModel.findById(temp)
        }
        await subReply.deleteOne();
        comment.firstReplyOnComment = null;
        await comment.save();
    }
    else if(reply.replyAfter===null)
        await replyModel.findByIdAndUpdate({_id:reply.replyBefore},{replyAfter:null});

    else {
        let subReply = await replyModel.findById(reply.replyAfter);
        while(subReply.replyAfter !== null) {
            let temp = subReply.replyAfter;
            await subReply.deleteOne();
            subReply = await replyModel.findById(temp)
        }
        await subReply.deleteOne();
        await replyModel.findByIdAndUpdate({_id:reply.replyBefore},{replyAfter:null});
    }
    const result = await reply.deleteOne();
        (result.deletedCount != 1 ) && next(new AppError("fail to delete reply try again", 400));

    res.status(200).json({msg:"done reply is deleted and all its sub replies if exist"});
};
