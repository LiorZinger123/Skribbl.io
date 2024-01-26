export default () => ({
    database: process.env.DATABASE,
    port: parseInt(process.env.PORT),
    cookies: process.env.COOKIES_SECRET,
    jwt: process.env.JWT_SECRET,
    cookieExpirationTime: process.env.COOKIE_EXPIRATION_TIME,
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME
})