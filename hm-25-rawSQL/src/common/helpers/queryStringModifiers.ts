import { BlogQueryType, BlogQueryOutputType } from 'src/features/blogs/types/types';
import { CommentQueryType, CommentQueryOutputType } from 'src/features/comments/types/types';
import { PostQueryOutputType, PostQueryType } from 'src/features/posts/types/types';
import { UserQueryOutputType, UserQueryType } from 'src/features/users/types/types';
import { QuestionQueryOutputType, QuestionQueryType } from '../../features/question/types/types';
import { GameQueryOutputType, GameQueryType } from '../../features/game/types/types';
import { GameQueryDTO } from '../../features/game/api/modules/input/game-query.dto';
import { StatisticQueryDTO } from '../../features/game/api/modules/input/statistic-query.dto';


export const userQueryParams = (
  query: Partial<UserQueryType>,
): UserQueryOutputType => {
  const allowedSortByValues = ['id', 'login', 'email', 'createdAt'];
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize ? +query.pageSize : 10,
    searchLoginTerm: query.searchLoginTerm ? query.searchLoginTerm : null,
    searchEmailTerm: query.searchEmailTerm ? query.searchEmailTerm : null,
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

export const gameQueryParams = (query: GameQueryDTO): GameQueryOutputType => {
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize ? +query.pageSize : 10,
    sortBy: query.sortBy ? query.sortBy : "pairCreatedDate",
    sortDirection: query.sortDirection ? query.sortDirection : "desc"
  }
}

export const statisticQueryParams = (query: StatisticQueryDTO) :StatisticQueryDTO => {
  return {
    pageNumber: query.pageNumber ? +query.pageNumber : 1,
    pageSize: query.pageSize ? +query.pageSize : 10,
    sort: query.sort ? query.sort : ["avgScores desc", "sumScore desc"],

  }
}
