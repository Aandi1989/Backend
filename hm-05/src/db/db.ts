import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
import { BlogType, PostType, UserType } from "../types";


dotenv.config();

// const mongoUri = "mongodb://0.0.0.0:27017" || process.env.MONGO_URL;
const mongoUri = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";

export const client = new MongoClient(mongoUri);
// const db = client.db("hm-03")
const db = client.db("hm-03-tests")
export const blogsCollection = db.collection<BlogType>("blogs");
export const postsCollection = db.collection<PostType>("posts");
export const usersCollection = db.collection<UserType>("users");

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

