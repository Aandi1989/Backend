export type BlogType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
}

export type PostType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName?: string,
}

export const db: DBType = {
    blogs: [
        {id: '1', name: 'the first blog', description: 'some description', websiteUrl: 'www.blogs.com'}
    ],
    posts: [
        {id: '1', title: 'main title', shortDescription: 'brief description', 
        content: 'cool content', blogId: '12', blogName: 'John Blogs'}
    ]
}


export type DBType = {
    blogs: BlogType[],
    posts: PostType[]
}