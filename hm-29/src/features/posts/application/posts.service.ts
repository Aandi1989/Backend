import { Injectable } from "@nestjs/common";
import { PostsRepository } from "../repo/posts.repository";
import { CreatePostModel } from "../api/models/input/create-post.input.model";

@Injectable()
export class PostsService {
    constructor(protected postsRepository: PostsRepository){}

}