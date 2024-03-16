export type ValidateType = {
    username: string, 
    password: string
}

export type LoginType = {
    username: string,
    password?: string,
    rememberMe: boolean
}

export type CreateUserType = {
    username: string, 
    password: string,
    email: string
}

export type AccessTokenType = {
    accessToken: string
}