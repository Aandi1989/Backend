import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Blog } from "../domain/blogs.schema";
import { Model } from "mongoose";
import { BlogType, DBBlogType } from "../types/types";
import { CreateBlogModel } from "../api/models/input/create-blog.input.model";


@Injectable()
export class BlogsRepository {
    constructor(
        @InjectModel(Blog.name)
        private BlogModel: Model<Blog>,
      ) { }
      async createBlog(newBlog: BlogType): Promise<BlogType>{
        const result = await this.BlogModel.insertMany([newBlog])
        // @ts-ignore
        return this._mapDBBlogToBlogOutputModel(newBlog)
    }
    async updateBlog(id: string ,data: Partial<CreateBlogModel>): Promise<boolean>{
        const result = await this.BlogModel.updateOne({id: id},{ $set: {...data} })
        return result.matchedCount === 1
    }
    async deleteBlog(id: string):Promise<boolean> {
        const result = await this.BlogModel.deleteOne({id: id})
        return result.deletedCount === 1
    }
    async deleteAllData(){
        await this.BlogModel.deleteMany({});
      }
      _mapDBBlogToBlogOutputModel(blog: DBBlogType): BlogType {
        return {
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }
    }  
}