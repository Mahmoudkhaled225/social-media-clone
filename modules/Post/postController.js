import postModel from "../../DB/models/postModel.js";
import categoryModel from "../../DB/models/categoryModel.js";
import commentModel from "../../DB/models/commentModel.js";
import AppError from "../../utils/ErrorHandling/AppError.js";
import replyModel from "../../DB/models/replyModel.js";


/**
 * @desc      Create a new Post
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message and the created post
 * @route   POST /pinterest/v1/post/addpost
 * @access  Private Admin Only

 */

export const addPost = async (req, res ,next) =>{
    let cat;
    const{title,description,category} = req.body;
    const post = new postModel({title,description});
    for (let i = 0; i <category.length; i++) {
        cat = await categoryModel.findOne({name:category[i]});
        (!cat) && next(new AppError(`no such category ${category[i]}`, 404));
        if (cat){
            cat.post.push(post._id);
            post.category.push(cat.name);
        }
        await cat.save();
    }
    await post.save();
    (post) && res.status(200).json({msg:"done post is added",post});
    next(new AppError("fail to add post try again", 400));
};


/**
 * @desc      updata post's title
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message and the updated post
 * @route   PATCH /pinterest/v1/post/updateposttitle/:_id
 * @access  Private Admin Only

 */

export const updatePostTitle = async (req, res ,next) =>{
    const {title} = req.body;
    const {_id} = req.params;
    const post = await postModel.findByIdAndUpdate(_id,{title},{new:true});
    post && res.status(200).json({msg:"done post's title is updated",post});
    next(new AppError("fail to update post's title try again", 400));
};

/**
 * @desc      updata post's description
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message and the updated post
 * @route   PATCH /pinterest/v1/post/updatepostdescription/:_id
 * @access  Private Admin Only

 */

export const updatePostDescription = async (req, res ,next) => {
    const {description} = req.body;
    const {_id} = req.params;
    const post = await postModel.findByIdAndUpdate(_id,{description},{new:true});
    post && res.status(200).json({msg:"done post's description is updated",post});
    next(new AppError("fail to update post's title try again", 400));
};

/**
 * @desc      add new category on POST
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message and the updated post
 * @route   PATCH /pinterest/v1/post/addcategory/:_id
 * @access  Private Admin Only

 */

export const addNewCategoryOnPost = async (req, res ,next) => {
    const {categoryName} = req.body;
    let cat = await categoryModel.findOne({name:categoryName});
    (!cat) && next(new AppError(`no such category ${categoryName} to add to the post`, 404));
    const {_id} = req.params;
    const post = await postModel.findById(_id);
    if(post.category.includes(cat._id))
        return next(new AppError(`category ${categoryName} is already exist on the post`, 400));
    if (cat){
        cat.post.push(post._id);
        post.category.push(cat._id);
    }
    await cat.save();
    await post.save();
    (post) && res.status(200).json({msg:`done post's new ${categoryName} is added`,post,cat});

};


/**
 * @desc      delete category tag from POST
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message
 * @route   PATCH /pinterest/v1/post/deletecategory/:_id
 * @access  Private Admin Only

 */

export const deleteCategoryOnPost = async (req, res ,next) => {
    const {categoryName} = req.body;
    let cat = await categoryModel.findOne({name:categoryName});
    (!cat) && next(new AppError(`no such category ${categoryName} to be deleted`, 404));
    const {_id} = req.params;
    const post = await postModel.findById(_id);
    if(!post.category.includes(cat._id))
        return next(new AppError(`category ${categoryName} is not exist on the post`, 400));
    if (cat){
        cat.post.pop(post._id);
        post.category.pop(cat._id);
    }
    await cat.save();
    await post.save();
    (post) && res.status(200).json({msg:`done post's ${categoryName} is deleted`,post,cat});
};


/**
 * @desc      get all posts
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @param     { Callback } next - to be called after this middleware function
 * @returns   { JSON } - A JSON object representing the type, message and the all posts
 * @route   GET /pinterest/v1/post/getallposts
 * @access  Private Admin Only

 */
export const getAllPosts = async (req, res ,next) => {
    const posts = await postModel.find();
    (posts.length !==0 ) && res.status(200).json({msg:"done",posts});
    (!posts) && next(new AppError("no posts", 404));
    next(new AppError("fail to get all posts try again", 400));
}



// there is nothing you have to do with the likes and dislikes
// it will drop with the post document, and it is child parent relationship

// it will be done soon

// export const deletePost = async (req, res ,next) => {
//     const {_id} = req.params;
//     const post = await postModel.findById(_id);
//     (!post) && next(new AppError("no such post", 404));
//     const cat = post.category;
//     for (const element of cat) {
//         // await categoryModel.findByIdAndUpdate(element,{pull:{post: post._id}})
//          const category = await categoryModel.findById(String(element));
//          category.post.pop(post._id);
//          await category.save();
//     }
//     for (const element of post.comments) {
//         const comment = await commentModel.findById(element);
//         if(comment.firstReplyOnComment) {
//             const reply = await replyModel.findById(comment.firstReplyOnComment);
//             if (reply.replies.length !== 0){
//                 for (const rep in reply.replies) {
//                     await replyModel.findByIdAndDelete(rep);
//                 }
//             }
//             await reply.deleteOne();
//         }
//         await comment.deleteOne();
//     }
//     (post) && res.status(200).json({msg:"done post is deleted and all comment under it and and all replies",post});
//     next(new AppError("fail to delete post try again", 400));
// };
