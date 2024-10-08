import { myStatus } from "src/features/comments/types/types"

export class CommentsWithQueryOutputModel {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: CommentOutputModel[]
}

export class CommentOutputModel  {
    id: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
    likesInfo: {
        likesCount: number
        dislikesCount: number
        myStatus: myStatus
    }
    postInfo?:{
        id: string
        title: string
        blogId: string
        blogName: string
    }
}