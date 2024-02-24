export const blogQueryParams = (query: Partial<BlogQueryType>): BlogQueryOutputType => {
    return {
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize ? +query.pageSize : 10,
        searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
        sortBy: query.sortBy ? query.sortBy : "createdAt",
        sortDirection: query.sortDirection ? query.sortDirection : "desc"
    };
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