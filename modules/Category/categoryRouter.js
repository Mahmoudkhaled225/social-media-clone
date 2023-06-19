import {Router} from "express";
import * as categoryController from "./categoryController.js";
import * as validators from "./categoryValidation.js";
import authentication from "../../middleware/authentication.js";
import asyncHandler from "../../utils/ErrorHandling/asyncHandler.js";
import authorization from "../../middleware/authorization.js";
import accessRoles from "../EndPoints.js";
import validation from "../../middleware/validation.js";
const categoryRouter = Router();

categoryRouter.post("/addcategory",asyncHandler(authentication()),authorization(accessRoles.admin),
    validation(validators.createCategoryValidation),
    asyncHandler(categoryController.createCategory));

categoryRouter.get("/getall",asyncHandler(authentication()),authorization(accessRoles.admin),
    asyncHandler(categoryController.getAllCategories));

categoryRouter.patch("/updatecat/:name",asyncHandler(authentication()),authorization(accessRoles.admin),
    validation(validators.updateCategoryValidation),
    asyncHandler(categoryController.updateCategory));

categoryRouter.delete("/deletecat/:name",asyncHandler(authentication()),authorization(accessRoles.admin),
    validation(validators.deleteCategoryValidation),
    asyncHandler(categoryController.deleteCategory));





export default categoryRouter;