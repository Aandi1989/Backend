export const accountExistError = (fieldName: string, value: string) => {
    return  [{ message: `Account with ${fieldName} ${value} alredy exist`, field: `${fieldName}` }]
}