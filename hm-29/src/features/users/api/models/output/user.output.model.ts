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

  export type BannedUserInfo = {
    id: string,
    login: string,
    banInfo: BanInfo
  }

  export class BannedUsersInfoOutputModel {
    pagesCount: number
    page: number
    pageSize: number
    totalCount: number
    items: BannedUserInfo[]
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