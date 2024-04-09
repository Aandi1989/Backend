export function postsOutputModel(arr){
    let result: any = [];
    let addedPosts = {};

    for(const post of arr){
        let postWithLikes = addedPosts[post.id]
        if(!postWithLikes){
            postWithLikes = {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName ? post.blogName : '',
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.likeCount,
                dislikesCount: post.dislikeCount,
                myStatus: post.myStatus,
                newestLikes: []
            }
        }
        result.push(postWithLikes);
        addedPosts[post.id] = postWithLikes;
        }
        postWithLikes.extendedLikesInfo.newestLikes.push({
            addedAt: post.addedAt,
            userId: post.userId,
            login: post.login
        })
    }
    return result;
}