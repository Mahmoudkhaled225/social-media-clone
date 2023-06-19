import joi from "joi";
import {generalFields} from "../../middleware/validation.js";

export const addFirstReplyOnCommentValidation = joi.object({
    commentId: generalFields.id,
    replyText: joi.required(),
});

export const addReplyOnReplyValidation = joi.object({
    replyText: joi.required(),
    replyId: generalFields.id,
});

export const updateReplyTextValidation = joi.object({
    replyId: generalFields.id,
    newText: joi.required(),
});

export const deleteReplyValidation = joi.object({
    commentId: generalFields.id,
    replyId: generalFields.id,
});