import mongoose from "mongoose";
import { apiCallsSchema, blogsSchema, commentsSchema, likeSchema, postsSchema, sessionsSchema, usersSchema } from "./schemas";


export const blogsModel = mongoose.model('blogs', blogsSchema);
export const postsModel = mongoose.model('posts', postsSchema);
export const commentsModel = mongoose.model('comments', commentsSchema);
export const usersModel = mongoose.model('accounts', usersSchema);
export const sessionsModel = mongoose.model('sessions', sessionsSchema);
export const apiCallsModel = mongoose.model('apiCalls', apiCallsSchema);
export const likesModel = mongoose.model('likes', likeSchema)