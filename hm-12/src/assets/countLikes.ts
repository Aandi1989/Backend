import { likeType, myStatus } from "../types/types";

export function likeCounter(likes: likeType[], userId: string){
    let likesArray = [];
    let dislikesCount = 0;
    let myStatusLike = myStatus.None;
        for(const like of likes){
            if(like.status === myStatus.Like) likesArray.push(like);
            if(like.status === myStatus.Dislike) dislikesCount++;
            if(like.userId === userId) myStatusLike = like.status;
        };
    return { likesArray, dislikesCount, myStatusLike }
}