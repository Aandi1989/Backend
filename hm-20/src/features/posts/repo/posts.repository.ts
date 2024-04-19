import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { UpdatePostForBlogModel } from 'src/features/blogs/api/models/input/update-post.input';
import { DataSource, Repository } from 'typeorm';
import { Post } from '../domain/post.entity';
import { myStatus, PostSQL, PostType } from '../types/types';

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
        const result = await this.postRepository.clear();
    }
    _mapPostToOutputModel(post): PostType{
        return{
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createAt,
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: myStatus.None,
                    newestLikes: []
                }
        }
    }
}