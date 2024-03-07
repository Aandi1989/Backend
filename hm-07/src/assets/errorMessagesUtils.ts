 
export const accountExistError = (fieldName: string, value: string) => {
    return { errorsMessages: [{ message: `Account with ${fieldName} ${value} alredy exist`, field: `${fieldName}` }] }  
}

export const codeAlredyConfirmed = (code: string) => {
    return { errorsMessages: [{ message: `Code ${code} had been alredy confirmed`, field: "code" }] }  
}

export const codeDoesntExist = (code: string) => {
    return { errorsMessages: [{ message: `Code ${code} doesn't exist`, field: "code" }] }  
}

export const codeExpired = (code: string) => {
    return { errorsMessages: [{ message: `Code ${code} already expired`, field: "code" }] }  
}

export const emailDoesntExist = (email: string) => {
    return { errorsMessages: [{ message: `Email ${email} doesn't exist`, field: "email" }] }  
}

export const emailAlredyConfirmed = (email: string) => {
    return { errorsMessages: [{ message: `Email ${email} had been alredy confirmed`, field: "email" }] }  
}