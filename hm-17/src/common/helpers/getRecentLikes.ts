import { likeType } from "src/features/comments/types/types";


export function getRecentLikes(likes: likeType[]){
    const sortedLikes = likes.sort((a, b) => (new Date(b.createdAt)).getTime() - (new Date(a.createdAt)).getTime());
    return sortedLikes.slice(0, 3).map(like => ({ userId: like.userId, createdAt: like.createdAt }));
}