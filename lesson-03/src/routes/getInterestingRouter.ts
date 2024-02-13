import express from "express";
import { DBType } from "../db/db";
import { QueryCoursesModel } from "../models/QueryCoursesModel";
import { URIParamsCourseIdModel } from "../models/URIParamsCourseIdModel";
import { RequestWithParams, RequestWithQuery } from "../types";


export const getInterestingRouter = (db: DBType) => {
    const router = express.Router();

    router.get('/:id', (req: RequestWithParams<URIParamsCourseIdModel>, res) => {
       
        res.json({title: "data by id: " + req.params.id})
    })

    router.get('/books', (req: RequestWithQuery<QueryCoursesModel>,res) => {
       
        res.json({title: "books"})
    })
    

    return router;
}