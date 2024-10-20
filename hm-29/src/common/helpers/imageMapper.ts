import { BlogImageDict, ImageDict } from "../../features/posts/types/types";
import { ImageWithBlogIdType, ImageWithPostIdType } from "../types/types";

export function mainImagesMapper(images: ImageWithPostIdType[]){
    let imagesInfo: ImageDict = {};
    images.forEach(image => {
        if(!imagesInfo[image.postId]){
            imagesInfo[image.postId] = [
                {
                    url: image.url,
                    width: image.width,
                    height: image.height,
                    fileSize: image.fileSize
                }
            ]
        }else{
            imagesInfo[image.postId].push({
                    url: image.url,
                    width: image.width,
                    height: image.height,
                    fileSize: image.fileSize
            })
        }
    })
    return imagesInfo;
}

export function blogImagesMapper(images: ImageWithBlogIdType[]){
    let imagesInfo: BlogImageDict = {};
    images.forEach(image => {
        if(!imagesInfo[image.blogId]){
            imagesInfo[image.blogId] = {
                wallpaper: null,
                main: []
            }
        }

        if(image.imageType == 'wallpaper'){
            imagesInfo[image.blogId].wallpaper = {
                url: image.url,
                width: image.width,
                height: image.height,
                fileSize: image.fileSize
            }
        }else{
            imagesInfo[image.blogId].main.push({
                url: image.url,
                width: image.width,
                height: image.height,
                fileSize: image.fileSize
            })
        }
    })
    return imagesInfo;
}