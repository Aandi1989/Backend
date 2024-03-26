export type UserQueryType = {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: UserSortBy;
  sortDirection: sortDirectionType;
  pageNumber: string;
  pageSize: string;
};

export type UserQueryOutputType = {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  sortBy: UserSortBy;
  sortDirection: sortDirectionType;
  pageNumber: number;
  pageSize: number;
};

export type UserOutputType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type UsersWithQueryType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserOutputType[];
};

export type UserAuthType ={
    userId: string
    login: string
    email: string
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

export type CreateUserModel = {
  login: string,
  password: string,
  email: string
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
