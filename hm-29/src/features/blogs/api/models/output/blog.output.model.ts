import { BlogType } from "src/features/blogs/types/types";

export class BlogsWithQueryOutputModel {
     pagesCount: number;
     page: number;
     pageSize: number;
     totalCount: number;
     items: BlogType[];
}