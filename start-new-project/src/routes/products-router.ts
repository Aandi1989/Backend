import { Request, Response, Router, NextFunction } from "express";
import { productsRepository } from "../repositories/products-db-repository";
import { body, validationResult } from "express-validator";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { ProductType } from "../repositories/db";



export const productsRouter = Router({});

const titleValidation = body('title').trim().isLength({min: 3, max: 20}).withMessage('Title length must be at least 3 characters.')



productsRouter.post('/',
     titleValidation,
     inputValidationMiddleware,
    async (req: Request, res: Response) => {

    const newProduct: ProductType = await productsRepository.createProduct(req.body.title)
    res.status(201).send(newProduct)
})
productsRouter.put('/:id', 
    titleValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

    const isUpdated = await productsRepository.updateProduct(+req.params.id, req.body.title)
    if(isUpdated){
        const product = await productsRepository.findProductById(+req.params.id);
        res.send(product)
    }else{
        res.send(404)
    }
})
productsRouter.get('/', async (req: Request, res: Response) => {
    const foundProducts: ProductType[] = await productsRepository.findProducts(req.query.title?.toString());

    res.send(foundProducts)
})
productsRouter.get('/:id', async (req: Request, res: Response) => {
    let product = await productsRepository.findProductById(+req.params.id)
    if (product) {
        res.send(product)
    } else {
        res.send(404)
    }
})
productsRouter.delete('/:id', async (req: Request, res: Response) => {
    const isDeleted = await productsRepository.deleteProduct(+req.params.id)
    if(isDeleted){
        res.send(204)
    }else{
        res.send(404)
    }
})
