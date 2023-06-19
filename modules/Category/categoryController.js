import categoryModel from "../../DB/models/categoryModel.js";
import AppError from "../../utils/ErrorHandling/AppError.js";
import pagination from "../../services/pagination.js";

/**
 * @desc      Create a new category
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message and the created Category
 * @route   POST /pinterest/v1/category/add-category
 * @access  Private Admin Only

 */

export const createCategory = async (req, res ,next) => {
        const {name} = req.body;
        const cat = await categoryModel.findOne({name});
        (cat) && next(new AppError("category is already exist", 400));
        const category = await categoryModel.create({name});
        res.status(200).json(category);
        (category) && res.status(200).json({msg:"done category is added",category});
        next(new AppError("fail to add category try again", 400));
};


/**
 * @desc      get all categories
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message and the fetched Categories
 * @route   GET /pinterest/v1/category/getall
 * @access  Private Admin Only

 */

export const getAllCategories = async (req, res ,next)  => {
        const {page,size} = req.body;
        const {limit,skip} = pagination(page,size);
        const categories = await categoryModel.find().limit(limit).skip(skip).sort({name:1})
            .populate([{
                path: "post",
                    populate: [{
                        path: "comments",
                    }]
            }]);
        (categories.length === 0) && next(new AppError("no categories found",404));
        res.status(200).json({msg:"done",
                data: {
                        categories,
                        total:categories.length
                },meta: {
                        skip,
                        limit
                }
        });
};


/**
 * @desc      update category's name
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message and the updated Category
 * @route   patch /pinterest/v1/category/updatecat/:name
 * @access  Private Admin Only

 */

export const updateCategory = async (req, res ,next) => {
        const {name} = req.params;
        const {newName} = req.body;
        const category = await categoryModel.
        findOneAndUpdate({name},{name:newName},{new:true});
        res.status(200).json({msg:"done category is updated",category});
        (!category)&& next(new AppError("category is not updated", 400));
};

/**
 * @desc      delete categor
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message and the deleted Category
 * @route   DELETE /pinterest/v1/category/deletecat/:name
 * @access  Private Admin Only

 */

export const deleteCategory = async (req, res ,next) => {
        const {name} = req.params;
        const category = await categoryModel.findOneAndDelete({name});
        (category) && res.status(200).json({msg:"done category is deleted",category});
        next(new AppError("category is not deleted", 400));
};

