import express from "express"
import { getBlogsRouter } from "./features/blogs/blogs.router"
import { getPostsRouter } from "./features/posts/posts.router"
import { getTestRouter } from "./routes/tests"
import { RouterPaths } from "./utils"


export const app = express()

const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)



app.use(RouterPaths.posts, getPostsRouter())
app.use(RouterPaths.blogs, getBlogsRouter())
app.use(RouterPaths.__test__, getTestRouter())

