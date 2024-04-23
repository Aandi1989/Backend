import { BlogType } from "../../../types/types";


export class BlogsWithQueryOutputModel {
     pagesCount: number;
     page: number;
     pageSize: number;
     totalCount: number;
     items: BlogType[];
}