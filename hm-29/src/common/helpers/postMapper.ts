import { ImageDict, PostExtLikeInfoDict, PostSQL, PostType, PostWithImagesType } from "../../features/posts/types/types";

export function postMapper(posts: PostSQL[], likes: PostExtLikeInfoDict, images: ImageDict): PostType[]{
    const outputPosts: PostType[] = [];
    posts.forEach(post => {
        let outputPost:PostWithImagesType  = {
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
                  },
            images:{
                main: images[post.id] ? images[post.id] : []
            }
        }
        outputPosts.push(outputPost);
    })
    return outputPosts;
}