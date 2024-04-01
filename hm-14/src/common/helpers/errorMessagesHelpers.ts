export const accountExistError = (fieldName: string, value: string) => {
    return  [{ message: `Account with ${fieldName} ${value} alredy exist`, field: `${fieldName}` }]
}

export const codeDoesntExist = (code: string) => {
    return [{ message: `Code ${code} doesn't exist`, field: "code" }]
}

export const codeAlredyConfirmed = (code: string) => {
    return  [{ message: `Code ${code} had been alredy confirmed`, field: "code" }]
}


export const codeExpired = (code: string) => {
    return  [{ message: `Code ${code} already expired`, field: "code" }] 
}

export const emailDoesntExist = (email: string) => {
    return [{ message: `Email ${email} doesn't exist`, field: "email" }]  
}

export const emailAlredyConfirmed = (email: string) => {
    return [{ message: `Email ${email} had been alredy confirmed`, field: "email" }]  
}

export const recoveryCodeDoesntExist = (code: string) => {
    return [{ message: `Recovery code ${code} doesn't exist`, field: "recoveryCode" }]  
}