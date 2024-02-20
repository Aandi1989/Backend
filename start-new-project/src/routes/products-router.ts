import { Request, Response, Router, NextFunction } from "express";
import { ProductType, productsRepository } from "../repositories/products-repository";
import { body, validationResult } from "express-validator";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";



export const productsRouter = Router({});

const titleValidation = body('title').trim().isLength({min: 3, max: 10}).withMessage('Title length must be at least 3 characters.')



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

    const isUpdated = await productsRepository.updateProduct(+req.body.id, req.body.title)
    if(isUpdated){
        const product = productsRepository.findProductById(+req.body.id);
        res.send(product)
    }else{
        res.send(404)
    }
})
productsRouter.get('/', async (req: Request, res: Response) => {
    const foundProducts: ProductType[] = await productsRepository.findProducts(req.query.title?.toString());

    res.send(foundProducts)
})
productsRouter.get('/:id', (req: Request, res: Response) => {
    let product = productsRepository.findProductById(+req.params.id)
    if (product) {
        res.send(product)
    } else {
        res.send(404)
    }
})
productsRouter.delete('/:id', (req: Request, res: Response) => {
    const isDeleted = productsRepository.deleteProduct(+req.params.id)
    if(isDeleted){
        res.send(204)
    }else{
        res.send(404)
    }
})
