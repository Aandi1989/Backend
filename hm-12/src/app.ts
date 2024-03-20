import express from "express"
import { blogsRouter } from "./features/blogs/blogs.router"
import { postsRouter } from "./features/posts/posts.router"
import { getTestRouter } from "./routes/tests"
import { RouterPaths } from "./utils"
import { usersRouter } from "./features/users/users.router"
import { authRouter } from "./features/auth/auth.router"
import { commentsRouter } from "./features/comments/comments.router"
import cookieParser from "cookie-parser"
import { securityRouter } from "./features/security/security.router"


export const app = express()

const jsonBodyMiddleware = express.json()

// for getting ip from req.ip
app.set('trust proxy', true)

app.use(jsonBodyMiddleware)

// for getting cookies directly from req const coolie_name = req.cookies.cookie_name
app.use(cookieParser())



app.use(RouterPaths.posts, postsRouter)
app.use(RouterPaths.blogs, blogsRouter)
app.use(RouterPaths.users, usersRouter)
app.use(RouterPaths.auth, authRouter)
app.use(RouterPaths.comments, commentsRouter)
app.use(RouterPaths.security, securityRouter)
app.use(RouterPaths.__test__, getTestRouter())

