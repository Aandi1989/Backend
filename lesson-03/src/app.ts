import express from "express"
import { getTestsRouter } from "./routes/tests"
import { db } from "./db/db"
import { getInterestingRouter } from "./routes/getInterestingRouter"
import { getCoursesRouter } from "./routes/courses"



export const app = express()

const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)


app.use("/example", getCoursesRouter(db))
app.use("/__test__", getTestsRouter(db))
app.use("/interesting", getInterestingRouter(db))
