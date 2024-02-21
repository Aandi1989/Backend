import { DBType } from "./db";

export const db: DBType = {
    blogs: [
        {id: '1', name: 'the first blog', description: 'some description', websiteUrl: 'www.blogs.com',
        createdAt: "2024-02-21T13:20:15.566Z", isMembership:false}
    ],
    posts: [
        {id: '1', title: 'main title', shortDescription: 'brief description', 
        content: 'cool content', blogId: '12', blogName: 'John Blogs',createdAt: "2024-02-21T13:20:15.566Z"}
    ]
}