import express, {Request, Response} from 'express';
import { RequestWithBody, RequestWithParams, RequestWithQuery, RequestWithParamsAndBody } from './types';
import { CreateCourseModel } from './models/CreateCourseModel';
import { UpdateCourseModel } from './models/UpdateCourseModel';
import { QueryCoursesModel } from './models/QueryCoursesModel';
import { CourseViewModel } from './models/CourseViewModel';
import { URIParamsCourseIdModel } from './models/URIParamsCourseIdModel';

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

type CourseType = {
    id: number
    title: string
    studentsCount: number
}

const db: { courses: CourseType[]} = {
    courses: [
        {id:1, title: 'front-end', studentsCount: 10}, 
        {id:2, title: 'back-end', studentsCount: 10}, 
        {id:3, title: 'automation qa', studentsCount: 10}, 
        {id:4, title: 'devops', studentsCount: 10}
    ]
}

const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}


app.get('/courses', (req: RequestWithQuery<QueryCoursesModel>, 
                     res: Response<CourseViewModel[]>) => {
    let foundedCourses = db.courses;

    if(req.query.title){
        foundedCourses = foundedCourses.filter(c => c.title.indexOf(req.query.title) > -1)
    }
     

    res.json(foundedCourses.map(getCourseViewModel))
})
app.get('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>, 
                        res: Response<CourseViewModel>) => {
    const foundCourse = db.courses.find(c => c.id === +req.params.id)
    if(!foundCourse){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    res.json(getCourseViewModel(foundCourse))
})
app.post('/courses', (req: RequestWithBody<CreateCourseModel>, 
                      res: Response<CourseViewModel>) => {
    if(!req.body.title){
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return;
    }

    const createedCourse: CourseType = {
        id: +(new Date()), 
        title: req.body.title,
        studentsCount: 0
    }
    db.courses.push(createedCourse)
    res
    .status(HTTP_STATUSES.CREATED_201)
    .json(getCourseViewModel(createedCourse))
})
app.delete('/courses/:id', (req: RequestWithParams<URIParamsCourseIdModel>, 
                            res) => {
    db.courses = db.courses.filter(c => c.id !== +req.params.id)
    
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
app.put('/courses/:id', (req: RequestWithParamsAndBody<URIParamsCourseIdModel,
                         UpdateCourseModel>, res) => {
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


export const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

// yarn nodemon index.js запускаем nodemon при помощи yarn потому что nodemon у нас не установлен глобально
// yarn nodemon --inspect index.js получаем позможность дебажить
// yarn nodemon --inspect .\dist\index.js запускаем преобразованный из ts в js файл  
// yarn tsc -w запустить ts компилятор в режиме watcher
// added commands yarn dev & yarn watch in package.json 