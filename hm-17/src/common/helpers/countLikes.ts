import { Like } from "src/features/comments/types/types";
import { myStatus } from "src/features/posts/types/types";


export function likeCounter(likes: Like[], userId: string){
    let likesArray:Like[] = [];
    let dislikesCount = 0;
    let myStatusLike = myStatus.None;
        for(const like of likes){
            if(like.status === myStatus.Like) likesArray.push(like);
            if(like.status === myStatus.Dislike) dislikesCount++;
            if(like.userId === userId) myStatusLike = like.status;
        };
    return { likesArray, dislikesCount, myStatusLike }
}