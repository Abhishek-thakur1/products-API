import { NextFunction, Response, Request } from "express";
import {
    CreateProductInput,
    GetProductInput,
    UpdateProductInput,
    DeleteProductInput,
} from "../schemas/product.schema";
                                                                                            
import { createProduct, getProductById, getAllProducts } from '../services/product.service'
import AppError from '../utils/appError'


// create product
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

// get product by ID
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

// get all products
export const getAllProductsHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const products = await getAllProducts(req);

        res.status(200).json({
            status: 'success',
            results: products.length,
            data: {
                products,
            },
        });
    } catch (err: any) {
        next(err);
    }
};

// update product
export const updateProductHandler = async (
    req: Request<UpdateProductInput['params'], {}, UpdateProductInput['body']>,
    res: Response,
    next: NextFunction
) => {
    try {
        const product = await getProductById(req.params.productId);

        if (!product) {
            return next(new AppError(404, 'product with that ID not found'));
        }

        Object.assign(product, req.body);

        const updatedProduct = await product.save();

        res.status(200).json({
            status: 'success',
            data: {
                product: updatedProduct,
            },
        });
    } catch (err: any) {
        next(err);
    }
};


// delete product
export const deleteProductHandler = async (
    req: Request<DeleteProductInput>,
    res: Response,
    next: NextFunction
) => {
    try {
        const product = await getProductById(req.params.productId);

        if (!product) {
            return next(new AppError(404, 'product with that ID not found'));
        }

        await product.remove();

        res.status(204).json({
            status: 'success',
            data: null,
        });
    } catch (err: any) {
        next(err);
    }
};
