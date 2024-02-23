import { PostType, postsCollection } from "../db/db"
import { CreatePostModel } from "../features/posts/models/CreatePostModel";


export const postsRepository = {
    async getPosts(): Promise<PostType[]>{
        return postsCollection.find({}, {projection: { _id: 0} }).toArray();
    },
    async findPostById(id: string): Promise<PostType | null>{
        let post: PostType | null = await postsCollection.findOne({id:id}, {projection: { _id: 0}} )
        return post;
    },
    async createPost(newPost: PostType): Promise<PostType>{
        const result = await postsCollection.insertOne(newPost);
        return newPost;
    },
    async updatePost(id: string ,data: Partial<PostType>): Promise<boolean>{
        const result = await postsCollection.updateOne({id: id},{ $set: {...data} })
        return result.matchedCount === 1
    },
    async deletePost(id: string):Promise<boolean> {
        const result = await postsCollection.deleteOne({id: id})
        return result.deletedCount === 1
    }
    

} 