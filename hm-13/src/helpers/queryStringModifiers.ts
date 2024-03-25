import { UserQueryOutputType, UserQueryType } from 'src/users/types/types';

export const userQueryParams = (
  query: Partial<UserQueryType>,
): UserQueryOutputType => {
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize ? +query.pageSize : 10,
    searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
    searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,
    sortBy: query.sortBy ? query.sortBy : 'createdAt',
    sortDirection: query.sortDirection ? query.sortDirection : 'desc',
  };
};
