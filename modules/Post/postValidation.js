import joi from "joi";
import {generalFields} from "../../middleware/validation.js";

export const addPostValidation = joi.object({
    title: joi.string().required().min(1).max(32),
    category: joi.array().required(),
    description: joi.string().required().min(1).max(32),
    //userID: generalFields.id.required(),
}).required()

export const updatePostTitleValidation = joi.object({
    title: joi.string().required().min(1).max(32),
    _id: generalFields.id.required(),
    //userID: generalFields.id.required(),
}).required()

export const updatePostDescriptionValidation = joi.object({
    description: joi.string().required().min(1).max(32),
    _id: generalFields.id.required(),
    //userID: generalFields.id.required(),
}).required()

export const addNewCategoryOnPostValidation = joi.object({
    categoryName: joi.string().required().min(1).max(32),
    //userID: generalFields.id.required(),
}).required()

export const deleteCategoryOnPostValidation = joi.object({
    categoryName: joi.string().required().min(1).max(32),
    //userID: generalFields.id.required(),
}).required()

export const getAllPostsValidation = joi.object({
    //userID: generalFields.id.required(),
}).required()




