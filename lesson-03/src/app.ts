import express from "express"
import { getCoursesRouter } from "./routes/courses"
import { getTestsRouter } from "./routes/tests"
import { db } from "./db/db"
import { getInterestingRouter } from "./routes/getInterestingRouter"


export const app = express()

const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)


app.use("/courses", getCoursesRouter(db))
app.use("/__test__", getTestsRouter(db))

// this route doesn't work 
app.use("/interesting", getInterestingRouter(db))

