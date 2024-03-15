// import { MongoClient } from "mongodb";
// import { BlogType, CommentType, PostType, UserAccountDBType, apiCallType, refreshTokenType, sessionType } from "../types/types";
import { appConfig } from "../../config";
import mongoose from 'mongoose';
import { usersModel } from "./models";


// const mongoUri = "mongodb://0.0.0.0:27017" || appConfig.MONGO_URL;
const mongoUri = appConfig.MONGO_URL || "mongodb://0.0.0.0:27017";
let dbName = "hm-10"

// export const client = new MongoClient(mongoUri);
// const db = client.db("hm-03")
// const db = client.db("hm-03-tests")
// export const blogsCollection = db.collection<BlogType>("blogs");
// export const postsCollection = db.collection<PostType>("posts");
// export const commentsCollection = db.collection<CommentType>("comments");
// export const usersAcountsCollection = db.collection<UserAccountDBType>("accounts");
// export const sessionsCollection = db.collection<sessionType>("sessions");
// export const apiCallsCollection = db.collection<apiCallType>("apiCalls");

export async function runDb(){
    try {
        // Connect the client to the server
        // await client.connect();
        await mongoose.connect(mongoUri + "/" + dbName, {
            // added this string to avoid MongoBulkWriteError
            // @ts-ignore
            useNewUrlParser: true,
             useUnifiedTopology: true,
             writeConcern: { w: 'majority' },
          });
        // Establish and verify connection
        // await client.db("blogs").command({ ping:1 })
        console.log("Connected successfully to mongo server", mongoUri + "/" + dbName)
        // const users = await usersModel.find();
        // console.log('Found users:', users);
    } catch (error) {
        // Ensure that the client will close when you finish/error
        // await client.close()
        await mongoose.disconnect()
    }
}







