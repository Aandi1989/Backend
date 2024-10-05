import { PostExtLikeInfoDict, PostSQL, PostType } from "../../features/posts/types/types";

export function postMapper(posts: PostSQL[], likes: PostExtLikeInfoDict): PostType[]{
    const outputPosts: PostType[] = [];
    posts.forEach(post => {
        let outputPost:PostType  = {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: 
                likes[post.id] 
                ? likes[post.id] 
                : {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                    newestLikes: []
                  }
        }
        outputPosts.push(outputPost);
    })
    return outputPosts;
}