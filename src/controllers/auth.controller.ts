import { CookieOptions, NextFunction, Response, Request } from 'express'
import {createUserInput, loginUserInput} from '../schemas/user.schema'
import config = require('config')
import { createUser, findUserByEmail, findUserById, signTokens } from 'src/services/user.service'
import {User} from '../entities/user.entity'
import AppError from 'src/utils/appError'
import { signJwt, verifyJwt } from 'src/utils/jwt'
import redisClient from 'src/utils/connectRedis'


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


// Handling user LOGIN

export const loginUserHandler = async (
    req: Request<{}, {}, loginUserInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const {email, password} = req.body
        const user = await findUserByEmail({email})

        // /Check if user exists and password is valid
        if (!user || !(await User.comparePasswords(password, user.password))) {
            return next(new AppError(400, "Invalid email or password"));
        }

        //  Sign Access and Refresh Tokens
        const { access_token, refresh_token } = await signTokens(user);

        // Add Cookies
        res.cookie("access_token", access_token, accessTokenCookieOptions);
        res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
        res.cookie('logged_in', true, {
            ...accessTokenCookieOptions,
            httpOnly: false
        });


        // Send response
        res.status(200).json({
            status: 'success',
            access_token,
        });
        
    } catch (err: any) {
        next(err);
    }
}


// Refresh Access Token Controller
export const refreshAccessTokenHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const refresh_token = req.cookies.refresh_token;

        const message = 'Could not refresh access token';

        if (!refresh_token) {
            return next(new AppError(403, message));
        }

        // Validate refresh token
        const decoded = verifyJwt<{ sub: string }>(
            refresh_token,
            'refreshTokenPublicKey'
        );

        if (!decoded) {
            return next(new AppError(403, message));
        }

        // Check if user has a valid session
        const session = await redisClient.get(decoded.sub);

        if (!session) {
            return next(new AppError(403, message));
        }

        // Check if user still exist
        const user = await findUserById(JSON.parse(session).id);

        if (!user) {
        return next(new AppError(403, message));
        }

        // Sign new access token
        const access_token = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
            expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
        });

        // Add Cookies
        res.cookie('access_token', access_token, accessTokenCookieOptions);
        res.cookie('logged_in', true, {
            ...accessTokenCookieOptions,
            httpOnly: false,
        });

        // Send response
        res.status(200).json({
            status: 'success',
            access_token,
        });
    } catch (err: any) {
        next(err);
    }
};



// Logout User Controller
const logout = (res: Response) => {
    res.cookie("access_token", "", { maxAge: -1 });
    res.cookie("refresh_token", "", { maxAge: -1 });
    res.cookie("logged_in", "", { maxAge: -1 });
};
export const logoutHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = res.locals.user;

        await redisClient.del(user.id);
        logout(res);

        res.status(200).json({
            status: 'success',
        });
    } catch (err: any) {
        next(err);
    }
};