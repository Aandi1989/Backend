import express from "express"
import { getBlogsRouter } from "./features/blogs/blogs.router"
import { getPostsRouter } from "./features/posts/posts.router"
import { getTestRouter } from "./routes/tests"
import { RouterPaths } from "./utils"
import { getUsersRouter } from "./features/users/users.router"
import { getAuthRouter } from "./features/auth/auth.router"
import { getCommentsRouter } from "./features/comments/comments.router"
import cookieParser from "cookie-parser"
import { getSecurityRouter } from "./features/security/security.router"


export const app = express()

const jsonBodyMiddleware = express.json()

// for getting ip from req.ip
app.set('trust proxy', true)

app.use(jsonBodyMiddleware)

// for getting cookies directly from req const coolie_name = req.cookies.cookie_name
app.use(cookieParser())



app.use(RouterPaths.posts, getPostsRouter())
app.use(RouterPaths.blogs, getBlogsRouter())
app.use(RouterPaths.users, getUsersRouter())
app.use(RouterPaths.auth, getAuthRouter())
app.use(RouterPaths.comments, getCommentsRouter())
app.use(RouterPaths.security, getSecurityRouter())
app.use(RouterPaths.__test__, getTestRouter())

