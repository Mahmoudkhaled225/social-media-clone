import joi from "joi";
import {generalFields} from "../../middleware/validation.js";


export const addCommentValidation = joi.object({
    text: joi.string().required().min(1).max(32),
    postID: generalFields.id.required(),
    //userID: generalFields.id.required()
}).required()


export const updateCommentTextValidation = joi.object({
    newText: joi.string().required().min(1).max(32),
    postID: generalFields.id.required(),
    commentId: generalFields.id.required(),
    // userID: generalFields.id.required(),
}).required()


export const deleteCommentValidation = joi.object({
    postID: generalFields.id.required(),
    commentId: generalFields.id.required(),
    // userID: generalFields.id.required(),
}).required()

export const getAllCommentsOnPostValidation = joi.object({
    postID: generalFields.id.required(),
    // userID: generalFields.id.required(),
}).required()