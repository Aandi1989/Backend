import { BlogQueryType, BlogQueryOutputType } from 'src/features/blogs/types/types';
import { CommentQueryType, CommentQueryOutputType } from 'src/features/comments/types/types';
import { PostQueryOutputType, PostQueryType } from 'src/features/posts/types/types';
import { UserQueryOutputType, UserQueryType } from 'src/features/users/types/types';


export const userQueryParams = (
  query: Partial<UserQueryType>,
): UserQueryOutputType => {
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize ? +query.pageSize : 10,
    searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
    searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,
    sortBy: query.sortBy ? query.sortBy : "createdAt",
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
  return {
      pageNumber: query.pageNumber ? +query.pageNumber : 1,
      pageSize: query.pageSize ? +query.pageSize : 10,
      sortBy: query.sortBy ? query.sortBy : "createdAt",
      sortDirection: query.sortDirection ? query.sortDirection : "desc"
  };
}

export const commentQueryParams = (query: Partial<CommentQueryType>): CommentQueryOutputType => {
  return {
      pageNumber: query.pageNumber ? +query.pageNumber : 1,
      pageSize: query.pageSize ? +query.pageSize : 10,
      sortBy: query.sortBy ? query.sortBy : "createdAt",
      sortDirection: query.sortDirection ? query.sortDirection : "desc"
  };
}
