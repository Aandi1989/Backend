import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { productsRouter } from './routes/products-router'
import { addressesRouter } from './routes/addresses-router'

// create express app
const app = express()

const port = process.env.PORT || 5000




const parserMiddleware = bodyParser({})
app.use(parserMiddleware)



app.use('/addresses', addressesRouter)
app.use('/products', productsRouter)

// start app 
app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
})