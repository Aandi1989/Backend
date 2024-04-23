import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../domain/post.entity';
import { myStatus, PostSQL, PostType } from '../types/types';
import { UpdatePostForBlogModel } from '../../blogs/api/models/input/update-post.input';

@Injectable()
export class PostsRepository {
    constructor( @InjectRepository(Post) private readonly postRepository: Repository<Post>) { }

    async createPost(newPost: PostSQL): Promise<PostType> {
        const result = await this.postRepository.save(newPost);
        return this._mapPostToOutputModel(result);
    }
    async updatePost(id: string, data: UpdatePostForBlogModel): Promise<boolean> {
        const postToUpdate = await this.postRepository.findOneBy({id: id});
        if(!postToUpdate) throw new NotFoundException();
        const updatedPostData = {
            ...postToUpdate,
            ...data
        }
        const result = await this.postRepository.save(updatedPostData);
        return result ? true : false;
    }
    async deletePost(id: string): Promise<boolean> {
       const result = await this.postRepository.delete(id);
       return result.affected === 1;
    }
    async deleteAllData(){
        const result = await this.postRepository
        .createQueryBuilder()
        .delete()
        .execute();
    }
    _mapPostToOutputModel(post): PostType{
        return{
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: myStatus.None,
                    newestLikes: []
                }
        }
    }
}