import { BlogImagesSubscribers, BlogSubscribersDict, BlogSubscriberType, BlogType, BlogWithImagesType } from "../../features/blogs/types/types";
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

export function blogsMapper(blogs: BlogType[], images: BlogImageDict, 
    subscribers: BlogSubscribersDict):BlogImagesSubscribers[]{
    const outputBlogs: BlogImagesSubscribers[] = [];
    blogs.forEach(blog => {
        let outputBlog:BlogImagesSubscribers = {
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
            images:{
                main: images[blog.id]?.main ? images[blog.id].main : [],
                wallpaper: images[blog.id]?.wallpaper ? images[blog.id].wallpaper : null
            },
            currentUserSubscriptionStatus: subscribers[blog.id].currentUserSubscriptionStatus,
            subscribersCount: subscribers[blog.id].subscribersCount
        }
        outputBlogs.push(outputBlog);
    })
    return outputBlogs;
}

