import {object, string, number,  TypeOf} from "zod"

export const createProductSchema = object({
    body: object({
        title: string({
            required_error: 'Product should have a title',
        }),
        price: number({
            required_error: 'Product should have a price'
        }),
        description: string({
            required_error: 'Product should have a description'
        }),
        image: string({
            required_error: 'Product should have a image'
        }),
        category: string({
            required_error: 'Product should have a category'
        })
    })
})


const params = {
    params: object({
        productId: string(),
        
    })
}

export const getProductSchema = object({ ...params})

export const updateProductSchema = object({
    ...params,
    body: object({
        title: string(),
        price: number(),
        description: string(),
        image: string(),
        category: string(),
    }).partial()
})


export const deleteProductSchema = object({ ...params})

export type CreateProductInput = TypeOf<typeof createProductSchema>['body']
export type GetProductInput = TypeOf<typeof getProductSchema>['params']
export type UpdateProductInput = TypeOf<typeof updateProductSchema>
export type DeleteProductInput = TypeOf<typeof deleteProductSchema>['params']