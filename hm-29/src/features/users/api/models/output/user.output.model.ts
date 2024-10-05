export class UserOutputModel  {
    id: string
    login: string
    email: string
    createdAt: string
    banInfo?: BanInfo
  };

  type BanInfo = {
    isBanned: boolean,
    banDate: string | null,
    banReason: string | null
  }
  
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