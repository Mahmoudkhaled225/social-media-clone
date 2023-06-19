import asyncHandler from "../../utils/ErrorHandling/asyncHandler.js";
import * as commentController from "./commentController.js";
import authentication from "../../middleware/authentication.js";
import authorization from "../../middleware/authorization.js";
import validation from "../../middleware/validation.js";
import * as validators from "./commentValidation.js";

import accessRoles from "../EndPoints.js";
import {Router} from "express";


const commentRouter = Router();

// async route handler
commentRouter.post("/addcomment/:postID",
    asyncHandler(authentication()),
    authorization(accessRoles.user),
    validation(validators.addCommentValidation),
    asyncHandler(commentController.addComment));

commentRouter.patch("/updatecomment/:postID",
    asyncHandler(authentication()),
    authorization(accessRoles.user),
    validation(validators.updateCommentTextValidation),
    asyncHandler(commentController.updateCommentText));

commentRouter.get("/getallcomments/:postID",
    asyncHandler(authentication()),
    authorization(accessRoles.user),
    validation(validators.getAllCommentsOnPostValidation),
    asyncHandler(commentController.getAllCommentsOnPost));

commentRouter.delete("/deletecomment/:postID/:commentId",
    asyncHandler(authentication()),
    authorization(accessRoles.user),
    validation(validators.deleteCommentValidation),
    asyncHandler(commentController.deleteComment));

export default commentRouter;
