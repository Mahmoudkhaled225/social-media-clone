import {Router} from "express";
import * as postController from "./postController.js";
import * as validators from "./postValidation.js";
import authentication from "../../middleware/authentication.js";
import asyncHandler from "../../utils/ErrorHandling/asyncHandler.js";
import authorization from "../../middleware/authorization.js";
import accessRoles from "../EndPoints.js";
import validation from "../../middleware/validation.js";
const postRouter = Router();

postRouter.post("/addpost",
    asyncHandler(authentication()),
    authorization(accessRoles.admin),
    validation(validators.addPostValidation),
    asyncHandler(postController.addPost));

postRouter.patch("/updateposttitle/:_id",
    asyncHandler(authentication()),
    authorization(accessRoles.admin),
    validation(validators.updatePostTitleValidation),
    asyncHandler(postController.updatePostTitle));

postRouter.patch("/updatepostdescription/:_id",
    asyncHandler(authentication()),
    authorization(accessRoles.admin),
    validation(validators.updatePostDescriptionValidation),
    asyncHandler(postController.updatePostDescription));

postRouter.patch("/addcategory/:_id",
    asyncHandler(authentication()),
    authorization(accessRoles.admin),
    validation(validators.addNewCategoryOnPostValidation),
    asyncHandler(postController.addNewCategoryOnPost));

postRouter.delete("/deletecategory/:_id",
    asyncHandler(authentication()),
    authorization(accessRoles.admin),
    validation(validators.deleteCategoryOnPostValidation),
    asyncHandler(postController.deleteCategoryOnPost));


postRouter.get("/getallposts",
    asyncHandler(authentication()),
    authorization(accessRoles.admin),
    validation(validators.getAllPostsValidation),
    asyncHandler(postController.getAllPosts));


// to be tested
postRouter.delete("/deletepost/:_id",
    asyncHandler(authentication()),
    authorization(accessRoles.admin),
    asyncHandler(postController.deletePost));


export default postRouter;
