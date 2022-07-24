import { NextFunction, Request, Response } from 'express';

export const getUser = async(
    req: Request, res: Response, next: NextFunction
) => {
    try {
        const user = res.locals.user;
        res.status(200).status(200).json({ 
            status: 'success',
            data: {
                user
            }
        })
    } catch (err: any) {
        next(err);
    }
}