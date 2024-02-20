import { MongoClient } from "mongodb";

export type ProductType = {
    id: number,
    title: string
}

const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017";

export const client = new MongoClient(mongoUri);
const db = client.db("shop")
export const productsCollection = db.collection<ProductType>("products");

export async function runDb(){
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("products").command({ ping: 1 })
        console.log("Connected successfully to mongo server")
    } catch (error) {
        // Ensures that the client will close when you finish/error
        await client.close()
    }
}