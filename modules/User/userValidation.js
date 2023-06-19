import joi from "joi";
import {generalFields} from "../../middleware/validation.js";


export const signUpValidation = joi.object({
            name: joi.string().min(2).max(32).required().alphanum(),
            email: generalFields.email,
            password: generalFields.password,
            confirmationPassword: generalFields.confirmationPassword,
            age: joi.number().min(18).required(),
            file: generalFields.file,
});

export const confirmEmailValidation = joi.object({
    //string or alhpanum
    token : joi.required()
});


export const logInValidation = joi.object({
    email: generalFields.email,
    password: generalFields.password,
});

export const updateProfileValidation = joi.object({
    file:generalFields.file,
});

export const forgetPasswordValidation = joi.object({
    email: generalFields.email,
});

export  const resetPasswordValidation = joi.object({
    email: generalFields.email,
});

export const updatePasswordValidation = joi.object({
    //userID : generalFields.id,
    password: generalFields.password,
    confirmationPassword: generalFields.confirmationPassword,
});

export const deleteUserValidation = joi.object({
    _id : generalFields.id
});

export const updateUserNameAndAgeValidation = joi.object({
    name: joi.string().min(2).max(32).required().alphanum(),
    age: joi.number().min(18).required(),
});
