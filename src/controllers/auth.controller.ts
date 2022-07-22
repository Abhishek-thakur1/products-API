import {CookieOptions, NextFunction, Response, Request} from 'express'
import config = require('config')


const cookieOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax'
}

if(process.env.NODE_ENV == 'production') cookieOptions.secure = true

const accessTokenCookieOptions: CookieOptions = {
    ...cookieOptions,
    expires: new Date(
        Date.now() + config.get<number>("accessTokenExpiresIn") * 60 * 1000 
    ),
    maxAge: config.get<number>("accessTokenExpiresIn") *60 * 1000
}

const refreshTokenCookieOptions: CookieOptions = {
    ...cookieOptions,
    expires: new Date(
        Date.now() + config.get<number>("refreshTokenExpiresIn") * 60 * 1000 
    ),
    maxAge: config.get<number>("refreshTokenExpiresIn") *60 * 1000
}