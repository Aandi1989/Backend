import { Module } from "@nestjs/common";
import { CqrsModule } from '@nestjs/cqrs';
import { CommentsQueryRepo } from "./repo/comments.query.repository";
import { CommentsRepository } from "./repo/comments.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CommentsController } from "./api/comments.controller";
import { CreateCommentUseCase } from "./application/use-case/create-comment.use-case";
import { DeleteCommentUseCase } from "./application/use-case/delete-comment.use-case";
import { UpdateCommentUseCase } from "./application/use-case/update-comment.use-case";
import { JwtService } from "../../common/services/jwt-service";
import { UsersModule } from "../users/user.module";

@Module({
    imports:[ TypeOrmModule.forFeature(), UsersModule, CqrsModule],
    providers:[CommentsQueryRepo, CommentsRepository, CreateCommentUseCase, DeleteCommentUseCase, 
        UpdateCommentUseCase, JwtService],
    controllers:[CommentsController],
    exports: [CommentsQueryRepo, CommentsRepository]
})
export class CommentsModule {}