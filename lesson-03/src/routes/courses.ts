import express,{ Express, Response } from "express";
import { CourseViewModel } from "../models/CourseViewModel";
import { CreateCourseModel } from "../models/CreateCourseModel";
import { QueryCoursesModel } from "../models/QueryCoursesModel";
import { URIParamsCourseIdModel } from "../models/URIParamsCourseIdModel";
import { UpdateCourseModel } from "../models/UpdateCourseModel";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery } from "../types";
import { CourseType, DBType } from "../db/db";
import { HTTP_STATUSES } from "../utils";


export const getCourseViewModel = (dbCourse: CourseType): CourseViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title
    }
}



export const getCoursesRouter = (db: DBType) => {
    const router = express.Router();

    router.get('/', (req: RequestWithQuery<QueryCoursesModel>,
        res: Response<CourseViewModel[]>) => {
        let foundedCourses = db.courses;

        if (req.query.title) {
            foundedCourses = foundedCourses.filter(c => c.title.indexOf(req.query.title) > -1)
        }


        res.json(foundedCourses.map(getCourseViewModel))
    })
    router.get('/:id', (req: RequestWithParams<URIParamsCourseIdModel>,
        res: Response<CourseViewModel>) => {
        const foundCourse = db.courses.find(c => c.id === +req.params.id)
        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.json(getCourseViewModel(foundCourse))
    })
    router.post('/', (req: RequestWithBody<CreateCourseModel>,
        res: Response<CourseViewModel>) => {
        if (!req.body.title) {
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
    router.delete('/:id', (req: RequestWithParams<URIParamsCourseIdModel>,
        res) => {
        db.courses = db.courses.filter(c => c.id !== +req.params.id)

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    })
    router.put('/:id', (req: RequestWithParamsAndBody<URIParamsCourseIdModel,
        UpdateCourseModel>, res) => {
        if (!req.body.title) {
            res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
            return;
        }

        const foundCourse = db.courses.find(c => c.id === +req.params.id)
        if (!foundCourse) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        foundCourse.title = req.body.title

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    }) 

    return router;
}




