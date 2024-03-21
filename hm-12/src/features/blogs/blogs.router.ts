import { Router } from "express";
import { blogsController } from "../../composition-root";
import { authenticateUser } from "../../middlewares/authenticateUser-middleware";
import { blogIdValidationMiddleware, blogIdValidator } from "../../middlewares/blogId-paramsValidation-middleware";
import { blogPostValidator, blogUpdateValidator, inputValidationMiddleware } from "../../middlewares/blogs-bodyValidation-middleware";
import { blogQueryValidationMiddleware, blogQueryValidator } from "../../middlewares/blogs-queryValidation-middleware";
import { postCreateWithoutBlogIdValidator, inputValidationMiddleware as postInputValidationMiddleware } from "../../middlewares/posts-bodyValidation-middleware";
import { postQueryValidationMiddleware, postQueryValidator } from "../../middlewares/posts-queryValidation-middleware";
import { userDataFromAccessToken } from "../../middlewares/user-data-from-access-token-middleare";


export const blogsRouter = Router();


blogsRouter.get('/', ...blogQueryValidator, blogQueryValidationMiddleware, blogsController.getBlogs.bind(blogsController))
blogsRouter.post('/', authenticateUser, ...blogPostValidator, inputValidationMiddleware, 
    blogsController.createBlog.bind(blogsController))
blogsRouter.get('/:id', blogsController.getBlog.bind(blogsController))
blogsRouter.post('/:blogId/posts', authenticateUser, ...postCreateWithoutBlogIdValidator, blogIdValidator,
    postInputValidationMiddleware, blogIdValidationMiddleware, blogsController.createPostForBlog.bind(blogsController))
blogsRouter.get('/:blogId/posts', userDataFromAccessToken, blogIdValidator, ...postQueryValidator, postQueryValidationMiddleware,
    blogIdValidationMiddleware, blogsController.getPostsForBlog.bind(blogsController))
blogsRouter.put('/:id', authenticateUser, ...blogUpdateValidator, inputValidationMiddleware, 
    blogsController.updateBlog.bind(blogsController))
blogsRouter.delete('/:id', authenticateUser, blogsController.deleteBlog.bind(blogsController))
