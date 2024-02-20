import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import { productsRouter } from './routes/products-router'
import { runDb } from './repositories/db'


const app = express()

const port = process.env.PORT || 3000


// const parserMiddleware = bodyParser({})
const parserMiddleware = express.json()
app.use(parserMiddleware)



app.use('/products', productsRouter)


const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port: ${port}`)
    })
}

startApp()
