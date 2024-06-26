import { BlogQueryType, BlogQueryOutputType } from "../../features/blogs/types/types";
import { CommentQueryType, CommentQueryOutputType } from "../../features/comments/types/types";
import { PostQueryType, PostQueryOutputType } from "../../features/posts/types/types";
import { QuestionQueryOutputType, QuestionQueryType } from "../../features/question/types/types";
import { UserQueryType, UserQueryOutputType } from "../../features/users/types/types";



export const userQueryParams = (
  query: Partial<UserQueryType>,
): UserQueryOutputType => {
  const allowedSortByValues = ['id', 'login', 'email', 'createdAt'];
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize ? +query.pageSize : 10,
    searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : '',
    searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : '',
    // we use that method to avoid sql injection cause we cant use name of column as param $1 in postgres
    sortBy: query.sortBy && allowedSortByValues.includes(query.sortBy) ? query.sortBy : "createdAt",
    sortDirection: query.sortDirection ? query.sortDirection : 'desc',
  };
};

export const blogQueryParams = (query: Partial<BlogQueryType>): BlogQueryOutputType => {
  const allowedSortByValues = ["id", "name", "description", "websiteUrl", "createdAt", "isMembership"];
  return {
      pageNumber: query.pageNumber ? +query.pageNumber : 1,
      pageSize: query.pageSize ? +query.pageSize : 10,
      searchNameTerm: query.searchNameTerm ? query.searchNameTerm : '',
      // we use that method to avoid sql injection cause we cant use name of column as param $1 in postgres
      sortBy: query.sortBy && allowedSortByValues.includes(query.sortBy) ? query.sortBy : "createdAt",
      sortDirection: query.sortDirection ? query.sortDirection : "desc"
  };
}

export const postQueryParams = (query: Partial<PostQueryType>): PostQueryOutputType => {
  const allowedSortByValues = ["id", "title", "shortDescription", "content", "blogId", "blogName", "createdAt"];
  return {
      pageNumber: query.pageNumber ? +query.pageNumber : 1,
      pageSize: query.pageSize ? +query.pageSize : 10,
      // we use that method to avoid sql injection cause we cant use name of column as param $1 in postgres
      sortBy: query.sortBy && allowedSortByValues.includes(query.sortBy) ? query.sortBy : "createdAt",
      sortDirection: query.sortDirection ? query.sortDirection : "desc"
  };
}

export const commentQueryParams = (query: Partial<CommentQueryType>): CommentQueryOutputType => {
  const allowedSortByValues = ["id", "content", "createdAt"];
  return {
      pageNumber: query.pageNumber ? +query.pageNumber : 1,
      pageSize: query.pageSize ? +query.pageSize : 10,
      // we use that method to avoid sql injection cause we cant use name of column as param $1 in postgres
      sortBy: query.sortBy && allowedSortByValues.includes(query.sortBy) ? query.sortBy : "createdAt",
      sortDirection: query.sortDirection ? query.sortDirection : "desc"
  };
}

export const questionQueryParams = (query: Partial<QuestionQueryType>): QuestionQueryOutputType => {
  const allowedStatus = ["all", "published", "notPublished"]
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize ? +query.pageSize : 10,
    bodySearchTerm: query.bodySearchTerm ? query.bodySearchTerm : '',
    publishedStatus: query.publishedStatus && allowedStatus.includes(query.publishedStatus) ? query.publishedStatus : "all",
    sortBy: query.sortBy ? query.sortBy : "createdAt",
    sortDirection: query.sortDirection ? query.sortDirection : "desc"
  }
}
