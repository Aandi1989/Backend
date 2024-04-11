export function commentsOutputModel(arr){
    let result: any = [];
    let addedComments = {};
  
    for(const comment of arr){
        let commentWithLikes = addedComments[comment.id]
        if(!commentWithLikes){
            commentWithLikes = {
            id: comment.id,
            content: comment.content,
            commentatorInfo:{
              userId: comment.userId,
              userLogin: comment.userLogin,
            },
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesCount ? comment.likesCount : 0,
                dislikesCount: comment.dislikesCount ? comment.dislikesCount : 0,
                myStatus: comment.myStatus ? comment.myStatus : 'None',
            }
        }
        result.push(commentWithLikes);
        addedComments[comment.id] = commentWithLikes; // we do that to avoid cycle inside cycle 
        }
    }
    return result;
  }