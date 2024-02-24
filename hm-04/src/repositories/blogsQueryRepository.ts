import { BlogQueryOutputType, BlogQueryType } from "../assets/queryStringModifiers";
import { blogsCollection } from "../db/db";
import { BlogType, BlogsWithQueryType, DBBlogType } from "../types";

export const blogsQueryRepo = {
    async getBlogs(query: BlogQueryOutputType): Promise<BlogsWithQueryType> {
        const {pageNumber, pageSize, searchNameTerm, sortBy, sortDirection } = query;  
        const sortDir = sortDirection == "asc" ? 1 : -1;  
        const skip = (pageNumber -1) * pageSize; 
        const search = searchNameTerm ? { $regex: new RegExp(searchNameTerm, 'i') } : {$regex:''};
        const totalCount = await blogsCollection.countDocuments({name: search}); 
        const dbBlogs = await blogsCollection
        .find({name: search})
        .sort({[sortBy]: sortDir})
        .skip(skip)
        .limit(pageSize)
        .toArray();
        const pagesCount = Math.ceil(totalCount / pageSize);
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: dbBlogs.map(dbBlog => {
                return this._mapDBBlogToBlogOutputModel(dbBlog)
            })
        }
    },
    async findBlogById(id: string): Promise<BlogType | null> {
        let dbBlog: DBBlogType | null = await blogsCollection.findOne({ id: id })
        return dbBlog ? this._mapDBBlogToBlogOutputModel(dbBlog) : null
    },
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