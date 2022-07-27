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


