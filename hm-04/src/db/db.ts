import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

export type BlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
    _id?: string
}

export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName?: string,
    createdAt: string
    _id?: string
}


export type DBType = {
    blogs: BlogType[],
    posts: PostType[]
}



// const mongoUri = "mongodb://0.0.0.0:27017" || process.env.MONGO_URL;
const mongoUri = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";

export const client = new MongoClient(mongoUri);
const db = client.db("hm-03")
export const blogsCollection = db.collection<BlogType>("blogs");
export const postsCollection = db.collection<PostType>("posts");

export async function runDb(){
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("blogs").command({ ping:1 })
        console.log("Connected successfully to mongo server")
    } catch (error) {
        // Ensure that the client will close when you finish/error
        await client.close()
    }
}