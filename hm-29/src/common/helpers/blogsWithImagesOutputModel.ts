import { BlogSubscribersDict } from "../../features/blogs/types/types";

export function blogsOutputModel(arr: any, subscribers: BlogSubscribersDict){
    let result : any = [];
    let addedBlogs = {};

    for(const blog of arr){
        let blogWithImages = addedBlogs[blog.id]
        if(!blogWithImages){
            blogWithImages = {
                id: blog.id,
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership,
                images: {
                    wallpaper: null,
                    main: []
                },
                currentUserSubscriptionStatus: 'None',
                subscribersCount: 0
            }
            result.push(blogWithImages);
            addedBlogs[blog.id] = blogWithImages; // we do that to avoid cycle inside cycle
        }
        if(blog.imageType == "wallpaper"){
            blogWithImages.images.wallpaper = {
                url: blog.url,
                width: blog.width,
                height: blog.height,
                fileSize: blog.fileSize
            }
        }
        if(blog.imageType == "original"){
            blogWithImages.images.main.push({
                url: blog.url,
                width: blog.width,
                height: blog.height,
                fileSize: blog.fileSize
            })
        }
        if(subscribers[blog.id]){
            blogWithImages.currentUserSubscriptionStatus = subscribers[blog.id].currentUserSubscriptionStatus;
            blogWithImages.subscribersCount = subscribers[blog.id].subscribersCount
        }
    }
    return result;
}