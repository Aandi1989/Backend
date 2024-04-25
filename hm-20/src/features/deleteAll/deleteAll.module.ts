import { Module } from "@nestjs/common";
import { DeleteAllDataController } from "./deleteAll.controller";
import { BlogsModule } from "../blogs/blog.module";
import { UsersModule } from "../users/user.module";
import { CommentsModule } from "../comments/comment.module";
import { LikesModule } from "../likes/like.module";
import { PostsModule } from "../posts/post.module";
import { SessionsModule } from "../security/session.module";


@Module({
    imports:[ UsersModule, BlogsModule, PostsModule, CommentsModule, 
        LikesModule, SessionsModule
     ],
    providers:[],
    controllers:[DeleteAllDataController],
    exports: []
})
export class DeleteAllModule {}