import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { BlogType, CommentType, DBCommentType, PostType, UserType, apiCallType, likeType, myStatus, sessionType } from "../types/types";
import { User } from "../features/users/entities/user";

export const blogsSchema = new mongoose.Schema<BlogType>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
    isMembership: { type: Boolean, required: true },
}, { collection: 'blogs'});

export const postsSchema = new mongoose.Schema<PostType>({
    id: { type: String, required: true },
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: { type: String, required: false },
    createdAt: { type: String, required: true },
}, { collection: 'posts'});

export const likeTypeSchema = new mongoose.Schema<likeType>({
    id: { type: String, required: true },
    status: { type: String, required: true },
    userId: { type: String, required: true },
    parentId: { type: String, required: true },
    createdAt: { type: String, required: true }
}, { collection: 'likes'});

export const commentsSchema = new mongoose.Schema<DBCommentType>({
    id: { type: String, required: true },
    content: { type: String, required: true },
    postId: { type: String, required: true},
    commentatorInfo: {
        userId: { type: String, required: true },
        userLogin: { type: String, required: true },
    },
    createdAt: { type: String, required: true },
    likes: {type: [likeTypeSchema], required: true },
    dislikes: {type: [likeTypeSchema], required: true }
}, { collection: 'comments'});

const accountDataSchema = new mongoose.Schema<UserType>({
    id: { type: String, required: true },
    login: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: String, required: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
})

export const usersSchema = new mongoose.Schema<User>({
    _id: ObjectId,
    // accountData: accountDataSchema,  /* if use such approach _id will be created inside account data */
    accountData: {
        id: { type: String, required: true },
        login: { type: String, required: true },
        email: { type: String, required: true },
        createdAt: { type: String, required: true },
        passwordHash: { type: String, required: true },
        passwordSalt: { type: String, required: true },
    },
    emailConfirmation: {
        confirmationCode: { type: String, required: false },
        expirationDate: { type: Date, required: false },
        isConfirmed: { type: Boolean, required: false },
    },
    codeRecoveryInfo: {
        recoveryCode: { type: String, required: false },
        expirationDate: { type: Date, required: false },
        isConfirmed: { type: Boolean, required: false },
    }
}, { collection: 'accounts'});

export const sessionsSchema = new mongoose.Schema<sessionType>({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    iat: { type: String, required: true },
    deviceName: { type: String, required: true },
    ip: { type: String, required: true },
    exp: { type: String, required: true },
}, { collection: 'sessions'});

export const apiCallsSchema = new mongoose.Schema<apiCallType>({
    ip: { type: String, required: true },
    url: { type: String, required: true },
    date: { type: Date, required: true },
}, { collection: 'apiCalls'});

