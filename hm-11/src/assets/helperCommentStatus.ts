import { CommentType, DBCommentType, myStatus } from "../types/types";

export function defineStatus (comment: DBCommentType, userId: string) {
    const likedStatus = comment.likes.some(like => like.userId == userId) ? myStatus.Like : null;
    const dislikedStatus = comment.dislikes.some(dislike => dislike.userId == userId) ? myStatus.Dislike : null;
    if(likedStatus) return  myStatus.Like;
    if(dislikedStatus) return myStatus.Dislike;
    return myStatus.None
} 


export function setStatus (comment: DBCommentType, status: myStatus , userId: string){
    const currentStatus = defineStatus(comment, userId);
    if(currentStatus == status) return null;
    if(status == myStatus.None) return {like: 'remove', dislike: 'remove'};
    if(currentStatus == myStatus.None){
        return {like: status == myStatus.Like ? 'add' : null ,
                dislike: status == myStatus.Dislike ? 'add' : null }
    };
    return status == myStatus.Like 
    ? {like: 'add', dislike: 'remove'}
    : {like: 'remove', dislike: 'add'}
}