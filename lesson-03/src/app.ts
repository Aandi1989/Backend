import express from "express"
import { getTestsRouter } from "./routes/tests"
import { db } from "./db/db"
import { getInterestingRouter } from "./routes/getInterestingRouter"
import { getCoursesRouter } from "./features/courses/courses.router"
import { getUsersRouter } from "./features/users/users.router"
import { getUsersCoursesBindingsRouter } from "./features/users-courses-bindings/users-courses-bindings.router"


export const app = express()


export const RouterPaths = {
    courses: '/courses',
    users: '/users',
    usersCoursesBindings: '/users-courses-bindings',
    

    __test__: '/__test__'
}

const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)


app.use(RouterPaths.courses, getCoursesRouter(db))
app.use(RouterPaths.users, getUsersRouter(db))
app.use(RouterPaths.usersCoursesBindings, getUsersCoursesBindingsRouter(db))
app.use(RouterPaths.__test__, getTestsRouter(db))
// app.use("/interesting", getInterestingRouter(db))


