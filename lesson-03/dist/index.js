"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.get('/', (req, res) => {
    const a = 4;
    if (a > 5) {
        res.send('Ok!');
    }
    else {
        res.send('Hello World!!!');
    }
});
app.get('/samurais', (req, res) => {
    res.send('Hello Samurais!!!');
});
app.post('/samurais', (req, res) => {
    res.send('We have created samurai');
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
// yarn nodemon index.js запускаем nodemon при помощи yarn потому что nodemon у нас не установлен глобально
// yarn nodemon --inspect index.js получаем позможность дебажить
// yarn nodemon --inspect .\dist\index.js запускаем преобразованный из ts в js файл  
// yarn tsc -w запустить ts компилятор в режиме watcher
