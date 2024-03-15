import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { BlogType, CommentType, PostType, UserAccountDBType, apiCallType, sessionType } from "../types/types";

export const blogsSchema = new mongoose.Schema<BlogType>({
    id: String,
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean
}, { collection: 'blogs'});

export const postsSchema = new mongoose.Schema<PostType>({
    id: String,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: { type: String, required: false },
    createdAt: String
}, { collection: 'posts'});

export const commentsSchema = new mongoose.Schema<CommentType>({
    id: String,
    content: String,
    commentatorInfo: {
        userId: String,
        userLogin: String
    },
    createdAt: String
}, { collection: 'comments'});

export const usersSchema = new mongoose.Schema<UserAccountDBType>({
    _id: ObjectId,
    accountData: {
        id: String,
        login: String,
        email: String,
        createdAt: String,
        passwordHash: String,
        passwordSalt: String,
    },
    emailConfirmation: {
        confirmationCode: String,
        expirationDate: Date,
        isConfirmed: Boolean
    },
}, { collection: 'accounts'});

export const sessionsSchema = new mongoose.Schema<sessionType>({
    userId: String,
    deviceId: String,
    iat: String,
    deviceName: String,
    ip: String,
    exp: String
}, { collection: 'sessions'});

export const apiCallsSchema = new mongoose.Schema<apiCallType>({
    ip: String,
    url: String,
    date: Date
}, { collection: 'apiCalls'});