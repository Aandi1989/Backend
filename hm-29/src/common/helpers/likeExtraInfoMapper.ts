import { IntermedLikeType, myStatus, PostExtLikeInfoDict } from "../../features/posts/types/types";

export function likeExtraInfoMapper(likes: IntermedLikeType[], userId: string = ''): PostExtLikeInfoDict{
    let extraLikeInfo: PostExtLikeInfoDict = {};
    likes.forEach(like => {
        if(!extraLikeInfo[like.postId]){
            extraLikeInfo[like.postId] = {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: myStatus.None,
                newestLikes: []
            }
        }

        if(like.status == myStatus.Like){
            extraLikeInfo[like.postId].likesCount++;
        }

        if(like.status == myStatus.Dislike){
            extraLikeInfo[like.postId].dislikesCount++;
        }

        if(extraLikeInfo[like.postId].newestLikes.length < 3){
            extraLikeInfo[like.postId].newestLikes.push({
                addedAt: like.addedAt,
                userId: like.userId,
                login: like.login
            })
        }

        if(userId == like.userId){
            extraLikeInfo[like.postId].myStatus = like.status as myStatus
        }
    })
    return extraLikeInfo;
}