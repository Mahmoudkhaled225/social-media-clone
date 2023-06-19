import joi from "joi";
import {generalFields} from "../../middleware/validation.js";

export const createCategoryValidation = joi.object({
    name: joi.string().required().min(1).max(32),
    // userId: generalFields.id.required()
}).required()

export const updateCategoryValidation = joi.object({
        name: joi.string().required().min(1).max(32),
        newName: joi.string().required().min(1).max(32),
        // userId: generalFields.id.required()
}).required()


export const deleteCategoryValidation = joi.object({
    name: joi.string().required().min(1).max(32),
    // userId: generalFields.id.required()
}).required()
