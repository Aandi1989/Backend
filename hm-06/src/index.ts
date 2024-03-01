import { appConfig } from '../config';
import {app} from './app';
import { runDb } from './db/db';


const startApp = async () => {
    await runDb()
    app.listen(appConfig.PORT, () => {
        console.log(`Example app listening on port: ${appConfig.PORT}`)
    })
}

startApp()


// in bin folder  D:\Studying\mongodb\bin>mongod.exe --dbpath .\data\db
// in mongoshell folder after double click on mongosh.exe mongodb://localhost
// Стандартный URI для базы данных MongoDB на локальном компьютере обычно имеет следующий формат:mongodb://localhost:27017/<имя_базы_данных>
// в командной строке из рабочего стола D:\Studying\mongodb\bin\mongod.exe --dbpath .\data\db
