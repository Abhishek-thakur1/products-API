import { Request } from "express";
import {
    FindOptionsRelations,
    FindOptionsSelect,
    FindOptionsWhere,
    getRepository,
} from "typeorm";
import { Product } from '../entities/product.entity'
import {User} from '../entities/user.entity'
import {AppDataSource} from '../utils/data-source'

const productRepository = AppDataSource.getRepository(Product)

export const createProduct = async (input: Partial<Product>) => {
    return await productRepository.save(productRepository.create({...input}))
}

export const getProductById = async (productId: string) => {
    return await productRepository.findOneBy({ id: productId})
}

export const getAllProducts = async (req: Request) => {
    const builder = productRepository.createQueryBuilder('post');

    if (req.query.search) {
        builder.where('product.title LIKE :search OR product.content LIKE :search', {
            search: `%${req.query.search}%`,
        });
    }

    if (req.query.sort) {
        const sortQuery = req.query.sort === '-price' ? 'DESC' : 'ASC';
        builder.orderBy('product.title', sortQuery);
    }

    return await builder.getMany();
};


