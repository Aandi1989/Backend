export function commentsOutputWithPostInfoModel(arr){
    let result: any = [];
    let addedComments = {};
  
    for(const comment of arr){
        let commentWithLikes = addedComments[comment.id]
        if(!commentWithLikes){
            commentWithLikes = {
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt,
            commentatorInfo:{
              userId: comment.userId,
              userLogin: comment.userLogin,
            },
            likesInfo: {
                likesCount: comment.likesCount ? parseInt(comment.likesCount) : 0,
                dislikesCount: comment.dislikesCount ? parseInt(comment.dislikesCount) : 0,
                myStatus: comment.myStatus ? comment.myStatus : 'None',
            },
            postInfo: {
                blogId: comment.blogId,
                blogName: comment.blogName,
                title: comment.title,
                id: comment.postId,
            }
        }
        result.push(commentWithLikes);
        addedComments[comment.id] = commentWithLikes; // we do that to avoid cycle inside cycle 
        }
    }
    return result;
  }