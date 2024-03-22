import mongoose, { HydratedDocument, Model } from "mongoose";
import { apiCallsSchema, blogsSchema, commentsSchema, likeSchema, postsSchema, sessionsSchema, usersSchema } from "./schemas";
import { BlogType } from "../types/types";


export const blogsModel = mongoose.model('blogs', blogsSchema);
export const postsModel = mongoose.model('posts', postsSchema);
export const commentsModel = mongoose.model('comments', commentsSchema);
export const usersModel = mongoose.model('accounts', usersSchema);
export const sessionsModel = mongoose.model('sessions', sessionsSchema);
export const apiCallsModel = mongoose.model('apiCalls', apiCallsSchema);
export const likesModel = mongoose.model('likes', likeSchema);

//----------------------------------------------------------------------
// Example how to add customs methods to mongoose model

export const blogMethods = {
   // here we write our customs methods

}

export type BlogMethods = typeof blogMethods;

export type BlogModel = Model<BlogType, {}, BlogMethods>

export type BlogDocument = HydratedDocument<BlogType, BlogMethods>

blogsSchema.methods = blogMethods;

export const BlogsModel = mongoose.model<BlogType, BlogModel>('blogs', blogsSchema)

// ----------------------------------------------------------------------------------