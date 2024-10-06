export type UserQueryType = {
  banStatus: string | null;
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: UserSortBy;
  sortDirection: sortDirectionType;
  pageNumber: string;
  pageSize: string;
};

export type BannedUsersQueryType = {
  searchLoginTerm: string | null;
  sortBy: UserSortBy;
  sortDirection: sortDirectionType;
  pageNumber: string;
  pageSize: string;
}

export type UserQueryOutputType = {
  banStatus: string | null;
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: UserSortBy;
  sortDirection: sortDirectionType;
  pageNumber: number;
  pageSize: number;
};

export type BannedUsersQueryOutputType = {
  searchLoginTerm: string | null;
  sortBy: UserSortBy;
  sortDirection: sortDirectionType;
  pageNumber: number;
  pageSize: number;
};

export class UserSQL {
  id:string
  login:string
  email:string
  createdAt:string
  passwordHash:string
  passwordSalt:string
  confirmationCode?: string
  confCodeExpDate?: Date
  confCodeConfirmed?: boolean
  recoveryCode?: string
  recCodeExpDate?: Date
  recCodeConfirmed?: boolean
  isBanned: boolean
  banDate: string
  banReason: string
}


export type AccountData = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  passwordHash: string;
  passwordSalt: string;
}

export type EmailConfirmation = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
}

export type CodeRecoveryInfo = {
  recoveryCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
}

export type UserType = {
  id:string
  login:string
  email:string
  createdAt:string
  passwordHash:string
  passwordSalt:string
}

type UserSortBy = 'id' | 'login' | 'email' | 'createdAt';

type sortDirectionType = 'asc' | 'desc';
