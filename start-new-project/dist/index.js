"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_router_1 = require("./routes/products-router");
const addresses_router_1 = require("./routes/addresses-router");
const app = (0, express_1.default)();
let blablaMiddleware = (req, res, next) => {
    // @ts-ignore
    req.blabla = "hello";
    next();
};
const authGuardMiddleware = (req, res, next) => {
    if (req.query.token === '123') {
        next();
    }
    else {
        res.send(401);
    }
};
let requestCounter = 0;
const requestCountMiddleware = (req, res, next) => {
    requestCounter++;
    next();
};
app.use(requestCountMiddleware);
app.use(blablaMiddleware);
app.use(authGuardMiddleware);
const port = process.env.PORT || 3000;
// const parserMiddleware = bodyParser({})
const parserMiddleware = express_1.default.json();
app.use(parserMiddleware);
app.use('/addresses', addresses_router_1.addressesRouter);
app.use('/products', products_router_1.productsRouter);
// start app 
app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`);
});
