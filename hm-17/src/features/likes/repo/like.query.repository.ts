import { Injectable } from "@nestjs/common";
// import { InjectModel } from "@nestjs/mongoose";
// import { Model } from "mongoose";
// import { Like } from "../domain/likes.schema";
import { DataSource } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";

@Injectable()
export class LikesQueryRepo {
    constructor(@InjectDataSource() protected dataSourse: DataSource) { }
    
    async getLikePost(postId: string, userId: string){
        const query = `
            SELECT * FROM public."LikesPosts"
            WHERE "postId" = '${postId}' AND "userId" = '${userId}'
        `;
        const result = await this.dataSourse.query(query);
        return result[0];
    }
    async getLikeComment(commentId: string, userId: string){
        const query = `
            SELECT * FROM public."LikesComments"
            WHERE "commentId" = '${commentId}' AND "userId" = '${userId}'
        `;
        const result = await this.dataSourse.query(query);
        return result[0];
    }
}