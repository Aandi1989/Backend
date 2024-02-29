import {app} from './app';
import { runDb } from './db/db';

const port = 3000;


const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port: ${port}`)
    })
}

startApp()


// in bin folder  D:\Studying\mongodb\bin>mongod.exe --dbpath .\data\db
// in mongoshell folder after double click on mongosh.exe mongodb://localhost
// Стандартный URI для базы данных MongoDB на локальном компьютере обычно имеет следующий формат:mongodb://localhost:27017/<имя_базы_данных>
// в командной строке из рабочего стола D:\Studying\mongodb\bin\mongod.exe --dbpath .\data\db


// let searchFilter = (searchLoginTerm && searchEmailTerm) ?  {
//     $or: [
//         { login: { $regex: new RegExp(searchLoginTerm, 'i') } },
//         { email: { $regex: new RegExp(searchEmailTerm, 'i') } }
//     ]
// } : {};
// searchFilter = searchLoginTerm ? {
//     $or: [
//         { login: { $regex: new RegExp(searchLoginTerm, 'i') } },
//         { email: { $regex: new RegExp(searchLoginTerm, 'i') } }
//     ]
// } : {};
 