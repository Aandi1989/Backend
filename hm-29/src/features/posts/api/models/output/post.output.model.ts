import { PostType } from "src/features/posts/types/types"

export class PostsWithQueryOutputModel  {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostType[]
}