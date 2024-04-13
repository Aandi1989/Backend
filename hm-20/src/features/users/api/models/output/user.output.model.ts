export class UserOutputModel  {
    id: string
    login: string
    email: string
    createdAt: string
  };
  
  export class UsersWithQueryOutputModel  {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: UserOutputModel[]
  };

  export class UserAuthOutputModel  {
    userId: string
    login: string
    email: string
}