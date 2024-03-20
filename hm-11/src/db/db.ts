import { appConfig } from "../../config";
import mongoose from 'mongoose';


// const mongoUri = "mongodb://0.0.0.0:27017" || appConfig.MONGO_URL;
const mongoUri = appConfig.MONGO_URL || "mongodb://0.0.0.0:27017";
let dbName = "hm-10";
// let dbName = "hm-10-test";
const connectionpOptions = { dbName: `${dbName}`};

export async function runDb(){
    try {
        await mongoose.connect(mongoUri, connectionpOptions);
        console.log("Connected successfully to mongo server")
    } catch (error) {
        await mongoose.disconnect()
    }
}







