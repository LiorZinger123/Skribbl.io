export default () => ({
    database: process.env.DATABASE,
    port: parseInt(process.env.PORT),
    cookies: process.env.COOKIES_SECRET,
    jwt: process.env.JWT_SECRET,
    cookieExpirationTime: process.env.COOKIE_EXPIRATION_TIME,
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
    codeValidationCookieExpirationTime: process.env.CODE_VALIDATION_COOKIE_EXPIRATION_TIME,
    resetPasswordCookieExpirationTime: process.env.RESET_PASSWORD_COOKIE_EXPIRATION_TIME,
    mailHost: process.env.MAIL_HOST,
    mailPort: process.env.MAIL_PORT,
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASS,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: process.env.ACCESS_TOKEN
})