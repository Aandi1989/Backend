import { PostType } from "../../../types/types"


export class PostsWithQueryOutputModel  {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: PostType[]
}