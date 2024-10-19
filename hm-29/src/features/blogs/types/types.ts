import { ImageInfoType } from "../../../common/types/types"

export class BlogType  {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
    ownerId?: string
    isBanned?: boolean
    blogOwnerInfo?: BlogOwnerInfoType
    banInfo?: BanInfoType
}

export class BlogWithImagesType {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
    ownerId?: string
    isBanned?: boolean
    blogOwnerInfo?: BlogOwnerInfoType
    banInfo?: BanInfoType
    images: {
        wallpaper?: ImageInfoType | null
        main?: ImageInfoType[]
    }
}

export type BlogSaType = {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
    ownerId: string
    isBanned: boolean
    banDate: string | null
}
class BlogOwnerInfoType {
    userId: string | null
    userLogin: string | null
}

type BanInfoType = {
    isBanned: boolean,
    banDate: string | null
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

export type ImageType = {
    id: string,
    blogId?: string,
    postId?: string;
    url: string,
    width: number,
    height: number,
    fileSize: number,
    imageType: string
}