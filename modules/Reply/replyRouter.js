import asyncHandler from "../../utils/ErrorHandling/asyncHandler.js";

import * as replyController from "./replyController.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import accessRoles from "../EndPoints.js";
import {Router} from "express";
import validation from "../../middleware/validation.js";
import * as validators from "./replyValidation.js";

const replyRouter = Router();

// async route handler
replyRouter.post("/addfirstreply/:commentId",
    asyncHandler(authentication()),
    authorization(accessRoles.user),
    //validation(validators.addFirstReplyOnCommentValidation),
    asyncHandler(replyController.addFirstReplyOnComment));

replyRouter.post("/addreplyonreply/:replyId",
    asyncHandler(authentication()),
    authorization(accessRoles.user),
    //validation(validators.addReplyOnReplyValidation),
    asyncHandler(replyController.addReplyOnReply));


replyRouter.patch("/updatereply/:replyId",
    asyncHandler(authentication()),
    authorization(accessRoles.user),
    //validation(validators.updateReplyTextValidation),
    asyncHandler(replyController.updateReplyText));

replyRouter.delete("/deletereply/:commentId/:replyId",
    asyncHandler(authentication()),
    authorization(accessRoles.user),
    //validation(validators.deleteReplyValidation),
    asyncHandler(replyController.deleteReply));



export default replyRouter;
