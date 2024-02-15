"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const products_router_1 = require("./routes/products-router");
const addresses_router_1 = require("./routes/addresses-router");
// create express app
const app = (0, express_1.default)();
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
