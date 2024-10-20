import { ImageDict } from "../../features/posts/types/types";
import { ImageWithPostIdType } from "../types/types";

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