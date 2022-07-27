import express from "express";

import {
    createProductHandler,
    getProductByIdHandler,
    getAllProductsHandler,
    updateProductHandler,
    deleteProductHandler,
} from "../controllers/product.controller";

import {
    createProductSchema,
    getProductSchema,
    updateProductSchema,
    deleteProductSchema,
} from "../schemas/product.schema";

import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/requireUser";
import { validate } from "../middleware/validate";

const router = express.Router();

router.use(deserializeUser, requireUser);

router
    .route("/")
    .post(validate(createProductSchema), createProductHandler)
    .get(getAllProductsHandler);


router
    .route('/:postId')
    .get(validate(getProductSchema), getProductByIdHandler)
    .patch(validate(updateProductSchema), updateProductHandler)
    .delete(validate(deleteProductSchema), deleteProductHandler);
