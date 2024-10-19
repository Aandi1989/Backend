import { BlogType, BlogWithImagesType } from "../../features/blogs/types/types";

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