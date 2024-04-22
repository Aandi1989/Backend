export function updatedPostsOutputModel(posts, lastThreeLikes) {
    let result: any = [];
    let addedPosts = {};

    // Creating of dictionary for likes with grouping by postId
    let likesMap = lastThreeLikes.reduce((map, like) => {
        if (!map[like.postId]) {
            map[like.postId] = [];
        }
        map[like.postId].push({
            addedAt: like.createdAt,
            userId: like.userId,
            login: like.user_login
        });
        return map;
    }, {});

    for (const post of posts) {
        let postWithLikes = addedPosts[post.id];
        if (!postWithLikes) {
            postWithLikes = {
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName || '',
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: parseInt(post.likesCount) || 0,
                    dislikesCount: parseInt(post.dislikesCount) || 0,
                    myStatus: post.myStatus || 'None',
                    newestLikes: likesMap[post.id] || []  // using prepared map of likes
                }
            };
            result.push(postWithLikes);
            addedPosts[post.id] = postWithLikes; // save link for possible updates in the future
        }
    }
    return result;
}