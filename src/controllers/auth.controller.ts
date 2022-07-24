import { CookieOptions, NextFunction, Response, Request } from 'express'
import {createUserInput} from '../schemas/user.schema'
import config = require('config')
import { createUser } from 'src/services/user.service'


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


// Handling user registration
export const registerUserHandler = async(
    req: Request<{}, {}, createUserInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { firstName, lastName, password, email } = req.body
        
        const user = await createUser({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password
        });

        res.status(201).json({ 
            status: "success",
            data: {
                user
            }
        });

    } catch ( err : any) {
        if (err.code === '23505') {
            return res.status(409).json({ 
                status: 'fail',
                message: ''
            })
        }
        next(err);
    }
}