import express from "express"
import { RouterPaths } from "./utils"
import { db } from "./db/fakeDb"
import { getPostsRouter } from "./features/posts/posts.router"
import { getBlogsRouter } from "./features/blogs/blogs.router"
import { getTestRouter } from "./routes/tests"


export const app = express()

const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)



app.use(RouterPaths.posts, getPostsRouter())
app.use(RouterPaths.blogs, getBlogsRouter())
app.use(RouterPaths.__test__, getTestRouter(db))

