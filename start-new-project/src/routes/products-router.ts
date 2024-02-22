import { Request, Response, Router, NextFunction } from "express";
import { productsService } from "../domain/products-service";
import { body, validationResult } from "express-validator";
import { inputValidationMiddleware } from "../midlewares/input-validation-middleware";
import { ProductType } from "../repositories/db";



export const productsRouter = Router({});

const titleValidation = body('title').trim().isLength({min: 3, max: 20}).withMessage('Title length must be at least 3 characters.')



productsRouter.post('/',
     titleValidation,
     inputValidationMiddleware,
    async (req: Request, res: Response) => {

    const newProduct: ProductType = await productsService.createProduct(req.body.title)
    res.status(201).send(newProduct)
})
productsRouter.put('/:id', 
    titleValidation,
    inputValidationMiddleware,
    async (req: Request, res: Response) => {

    const isUpdated = await productsService.updateProduct(+req.params.id, req.body.title)
    if(isUpdated){
        const product = await productsService.findProductById(+req.params.id);
        res.send(product)
    }else{
        res.send(404)
    }
})
productsRouter.get('/', async (req: Request, res: Response) => {
    const foundProducts: ProductType[] = await productsService.findProducts(req.query.title?.toString());

    res.send(foundProducts)
})
productsRouter.get('/:id', async (req: Request, res: Response) => {
    let product = await productsService.findProductById(+req.params.id)
    if (product) {
        res.send(product)
    } else {
        res.send(404)
    }
})
productsRouter.delete('/:id', async (req: Request, res: Response) => {
    const isDeleted = await productsService.deleteProduct(+req.params.id)
    if(isDeleted){
        res.send(204)
    }else{
        res.send(404)
    }
})
