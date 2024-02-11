import express from 'express';

export const app = express()
const port = 3000

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
}

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

const db = {
    courses: [
        {id:1, title: 'front-end'}, 
        {id:2, title: 'back-end'}, 
        {id:3, title: 'automation qa'}, 
        {id:4, title: 'devops'}
    ]
}


app.get('/courses', (req, res) => {
    let foundedCourse = db.courses;

    if(req.query.title){
        foundedCourse = foundedCourse.filter(c => c.title.indexOf(req.query.title as string) > -1)
    }
     

    res.json(foundedCourse)
})
app.get('/courses/:id', (req, res) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id)
    if(!foundCourse){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    res.json(foundCourse)
})
app.post('/courses', (req, res) => {
    if(!req.body.title){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return;
    }

    const createedCourse = {id: +(new Date()), title: req.body.title}
    db.courses.push(createedCourse)
    res.status(HTTP_STATUSES.CREATED_201).json(createedCourse)
})
app.delete('/courses/:id', (req, res) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id)
    
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
app.put('/courses/:id', (req, res) => {
    if(!req.body.title){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return;
    }

    const foundCourse = db.courses.find(c => c.id === +req.params.id)
    if(!foundCourse){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    foundCourse.title = req.body.title

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})


app.delete('/__test__/data', (req, res) => {
    db.courses = [];
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// yarn nodemon index.js запускаем nodemon при помощи yarn потому что nodemon у нас не установлен глобально
// yarn nodemon --inspect index.js получаем позможность дебажить
// yarn nodemon --inspect .\dist\index.js запускаем преобразованный из ts в js файл  
// yarn tsc -w запустить ts компилятор в режиме watcher
// added commands yarn dev & yarn watch in package.json 