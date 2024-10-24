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
                likesCount: post.likesCount ? parseInt(post.likesCount) : 0,
                dislikesCount: post.dislikesCount ? parseInt(post.dislikesCount) : 0,
                myStatus: post.myStatus ? post.myStatus : 'None',
                newestLikes: []
            },
            images:{
                main:[]
            }
        }
        result.push(postWithLikes);
        addedPosts[post.id] = postWithLikes; // we do that to avoid cycle inside cycle 
        }
        if(post.userId){
        postWithLikes.extendedLikesInfo.newestLikes.push({
            addedAt: post.addedAt,
            userId: post.userId,
            login: post.login
        })}
    }
    return result;
}
