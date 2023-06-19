import {Router} from "express";
import * as userController from "./userController.js";
import {myMulter} from "../../services/multer.js";
import authentication from "../../middleware/authentication.js";
import asyncHandler from "../../utils/ErrorHandling/asyncHandler.js";
import validation from "../../middleware/validation.js";
import * as validators from "./userValidation.js";
import authorization from "../../middleware/authorization.js";
import accessRoles from "../EndPoints.js";
const userRouter = Router();




//asyncAPIS calls


userRouter.post("/signup",
    myMulter({customPath:"user"}).single("img"),
    validation(validators.signUpValidation),
    asyncHandler(userController.signUp));

userRouter.get("/confirmEmail/:token",
    validation(validators.confirmEmailValidation),
    asyncHandler(userController.confirmEmail));

userRouter.post("/login",validation(validators.logInValidation),asyncHandler(userController.logIn));


userRouter.post("/changepass",
    asyncHandler(authentication()),
    validation(validators.updatePasswordValidation),
    asyncHandler(userController.changePassword));

userRouter.patch(
    "/updateimg",
    authentication(),
    myMulter({customPath:"user"}).single("img"),
    validation(validators.updateProfileValidation),
    asyncHandler(userController.uploadProfilePicture)
);



//validation(deleteUserValidation) reduntednt
userRouter.delete("/delete",asyncHandler(authentication())
    ,authentication()
    ,validation(validators.deleteUserValidation)
    ,asyncHandler(userController.deleteUser));


userRouter.delete("/softdelete",
    asyncHandler(authentication()),
    asyncHandler(userController.softDeleteUser));

userRouter.patch("/update",asyncHandler(authentication()),
    validation(validators.updateUserNameAndAgeValidation),
    asyncHandler(userController.updateUserNameAndAge));

userRouter.get("/forgetpass/:email",
    validation(validators.forgetPasswordValidation),
    asyncHandler(userController.forgetPassword));

userRouter.get("/resetpass/:email",
    validation(validators.resetPasswordValidation),
    asyncHandler(userController.resetPassword));

userRouter.get("/logout",
    asyncHandler(authentication()),
    asyncHandler(userController.logOut));


userRouter.get("/getallusers",
    asyncHandler(authentication()),
    authorization(accessRoles.admin),
    asyncHandler(userController.getAllUsers));

userRouter.patch("/likepost/:postId",
    asyncHandler(authentication()),
    authorization(accessRoles.user),
    asyncHandler(userController.likePost));

userRouter.patch("/removelikeonpost/:postId",
    asyncHandler(authentication()),
    authorization(accessRoles.user),
    asyncHandler(userController.removeLikePost));


userRouter.patch("/dislikepost/:postId",
    asyncHandler(authentication()),
    authorization(accessRoles.user),
    asyncHandler(userController.dislikePost));

userRouter.patch("/removedislikeonpost/:postId",
    asyncHandler(authentication()),
    authorization(accessRoles.user),
    asyncHandler(userController.removeDislikePost));


userRouter.patch("/likecomment/:commentId",
    asyncHandler(authentication()),
    authorization(accessRoles.user),
    asyncHandler(userController.likeComment));

userRouter.patch("/dislikecomment/:commentId",
    asyncHandler(authentication()),
    authorization(accessRoles.user),
    asyncHandler(userController.dislikeComment));

userRouter.patch("/removelikeoncomment/:commentId",
    asyncHandler(authentication()),
    authorization(accessRoles.user),
    asyncHandler(userController.removeLikeComment));

userRouter.patch("/removedislikeoncomment/:commentId",
    asyncHandler(authentication()),
    authorization(accessRoles.user),
    asyncHandler(userController.removeDislikeComment));




//syncAPIS calls



export default userRouter;
