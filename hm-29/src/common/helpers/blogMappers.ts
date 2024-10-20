import { BlogType, BlogWithImagesType } from "../../features/blogs/types/types";
import { BlogImageDict } from "../../features/posts/types/types";

export function blogCreatedWithImages(blog: BlogType): BlogWithImagesType {
    const { id, name, description, websiteUrl, createdAt, isMembership } = blog;
    return{
        id,
        name,
        description,
        websiteUrl,
        createdAt,
        isMembership,
        images:{
            wallpaper: null,
            main: []
        }
    }
}

export function blogsMapper(blogs: BlogType[], images: BlogImageDict):BlogWithImagesType[]{
    const outputBlogs: BlogWithImagesType[] = [];
    blogs.forEach(blog => {
        let outputBlog:BlogWithImagesType  = {
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
            images:{
                main: images[blog.id].main ? images[blog.id].main : [],
                wallpaper: images[blog.id].wallpaper ? images[blog.id].wallpaper : null
            }
        }
        outputBlogs.push(outputBlog);
    })
    return outputBlogs;
}

