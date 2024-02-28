import express from "express"
import { getBlogsRouter } from "./features/blogs/blogs.router"
import { getPostsRouter } from "./features/posts/posts.router"
import { getTestRouter } from "./routes/tests"
import { RouterPaths } from "./utils"
import { getUsersRouter } from "./features/users/users.router"
import { getAuthRouter } from "./features/auth/auth.router"


export const app = express()

const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)



app.use(RouterPaths.posts, getPostsRouter())
app.use(RouterPaths.blogs, getBlogsRouter())
app.use(RouterPaths.users, getUsersRouter())
app.use(RouterPaths.auth, getAuthRouter())
app.use(RouterPaths.__test__, getTestRouter())

