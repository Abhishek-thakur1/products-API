import { NextFunction, Response, Request } from "express";
import {
    CreateProductInput,
    GetProductInput,
    UpdateProductInput,
    DeleteProductInput,
} from "../schemas/product.schema";
                                                                                            
import { createProduct, getProductById } from '../services/product.service'
import AppError from '../utils/appError'

export const createProductHandler = async(
    req: Request<{}, {}, CreateProductInput>,
    res: Response, 
    next: NextFunction
) => {
    try {
        const product = await createProduct(req.body)

        res.status(201).json({
            status: 'success',
            data: {
                product
            }
        })
    } catch (err: any) {
        if (err.code === '23505') {
            return res.status(409).json({ 
                status: 'fail',
                message: err.message
            })
        }
        next(err);
    }
}

export const getProductByIdHandler = async(
    req: Request<GetProductInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const product = await getProductById(req.params.productId);

        if (!product) return next(new AppError(404, 'Product with that ID doesn\'t exist'));

        res.status(200).json({
            status: 'success',
            data: {
                product
            }
        })

    } catch (err: any) {
        next(err)
    }
}
