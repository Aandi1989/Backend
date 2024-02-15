import { Request, Response, Router, NextFunction } from "express";
import { productsRepository } from "../repositories/products-repository";



export const productsRouter = Router({});



productsRouter.get('/', (req: Request, res: Response) => {
    // const foundProducts = productsRepository.findProducts(req.query.title?.toString());
    // res.send(foundProducts)
    // @ts-ignore
    const blabla = req.blabla;
    res.send({value: blabla + "!!!"})
})
productsRouter.post('/', (req: Request, res: Response) => {
    const newProduct = productsRepository.createProduct(req.body.title)
    res.status(201).send(newProduct)
})
productsRouter.get('/:id', (req: Request, res: Response) => {
    let product = productsRepository.findProductById(+req.params.id)
    if (product) {
        res.send(product)
    } else {
        res.send(404)
    }
})
productsRouter.put('/:id', (req: Request, res: Response) => {
    const isUpdated = productsRepository.updateProduct(+req.body.id, req.body.title)
    if(isUpdated){
        const product = productsRepository.findProductById(+req.body.id);
        res.send(product)
    }else{
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
