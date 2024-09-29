export class BlogType  {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
    ownerId?: string
    blogOwnerInfo?: BlogOwnerInfoType
}

class BlogOwnerInfoType {
    userId: string | null
    userLogin: string | null
}

export type BlogQueryType = {
    searchNameTerm: string | null,
    sortBy: BlogSortBy,
    sortDirection: sortDirectionType,
    pageNumber: string,
    pageSize: string
}

export type BlogQueryOutputType = {
    searchNameTerm: string | null,
    sortBy: BlogSortBy,
    sortDirection: sortDirectionType,
    pageNumber: number,
    pageSize: number
}


type BlogSortBy = "id" | "name" | "description" | "websiteUrl" | "createdAt" | "isMembership";

type sortDirectionType = "asc" | "desc";