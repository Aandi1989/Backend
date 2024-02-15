import express, { NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import { productsRouter } from './routes/products-router'
import { addressesRouter } from './routes/addresses-router'

const app = express()

let blablaMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    req.blabla = "hello";
    next();
}

const authGuardMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if(req.query.token === '123'){
        next();
    }else{
        res.send(401);
    }
}

let requestCounter = 0;
const requestCountMiddleware = (req: Request, res: Response, next: NextFunction) => {
    requestCounter++;
    next()
}


app.use(requestCountMiddleware)
app.use(blablaMiddleware)
app.use(authGuardMiddleware)

const port = process.env.PORT || 3000




// const parserMiddleware = bodyParser({})
const parserMiddleware = express.json()
app.use(parserMiddleware)



app.use('/addresses', addressesRouter)
app.use('/products', productsRouter)

// start app 
app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
})