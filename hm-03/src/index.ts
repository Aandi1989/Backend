import {app} from './app';

const port = 3000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// in bin folder  D:\Studying\mongodb\bin>mongod.exe --dbpath .\data\db
// in mongoshell folder after double click on mongosh.exe mongodb://localhost
// Стандартный URI для базы данных MongoDB на локальном компьютере обычно имеет следующий формат:mongodb://localhost:27017/<имя_базы_данных>
// в командной строке из рабочего стола D:\Studying\mongodb\bin\mongod.exe --dbpath .\data\db

 