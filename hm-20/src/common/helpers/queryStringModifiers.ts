import { BlogQueryType, BlogQueryOutputType } from 'src/features/blogs/types/types';
import { CommentQueryType, CommentQueryOutputType } from 'src/features/comments/types/types';
import { PostQueryOutputType, PostQueryType } from 'src/features/posts/types/types';
import { UserQueryOutputType, UserQueryType } from 'src/features/users/types/types';


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
      searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
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
