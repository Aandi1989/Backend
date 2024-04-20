import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateBlogModel } from "../api/models/input/create-blog.input.model";
import { Blog } from "../domain/blog.entity";
import { BlogType } from "../types/types";


@Injectable()
export class BlogsRepository {
    constructor(@InjectRepository(Blog) private readonly blogsRepository: Repository<Blog>) { }

    async createBlog(newBlog: BlogType): Promise<BlogType> {
       const result = await this.blogsRepository.save(newBlog);
       return result;
    }
    async updateBlog(id: string, data: CreateBlogModel): Promise<boolean> {
        const blogToUpdate = await this.blogsRepository.findOneBy({id: id});
        if(!blogToUpdate) throw new NotFoundException();
        const updatedBlogData = {
            ...blogToUpdate,
            ...data
        }
        const result = await this.blogsRepository.save(updatedBlogData);
        return result ? true : false;
    }
    async deleteBlog(id: string): Promise<boolean> {
        const result = await this.blogsRepository.delete(id);
        return result.affected === 1;
    }
    async deleteAllData() {
        const result = await this.blogsRepository.clear();
    }
}


/*
accessTokens:
Juan:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmY2E3OWIwMC04MWQ2LTRkNGUtOWFlNC1mYzRmOGU1ZmU5MTYiLCJpYXQiOjE3MTM1MjY2NzQsImV4cCI6MTcxNjIwNTA3NH0.0vP-qYgb1Jtl5aXcSOcrefky9LxUZoc-aiZavaSQQrM
John:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZmZhZmRjYi1iMTE3LTRjNGYtYjYwZC0zODU0ZDc3N2I1YzgiLCJpYXQiOjE3MTM2MjU0MDQsImV4cCI6MTcxNjMwMzgwNH0.JXiRDhBkXmgYg2k1Ld87MvomUjVjCIQ2YKUvcY4D3oc
Anna:   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiZGZiMWU5OC04ZGQwLTRkMWMtOGQ2ZS0wMDQ3NmVhYzQ5YjciLCJpYXQiOjE3MTM2MjU0NjUsImV4cCI6MTcxNjMwMzg2NX0.9rB2RQhtUfQD00dZPm1ZzUBR0UFUlKVCKCWyjXE78GQ
Fabi:   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMjg3ZTJjMy1hYWVkLTQ3NTMtODNiNy1iY2YwYzkxNWQzOGQiLCJpYXQiOjE3MTM2MjU1MDgsImV4cCI6MTcxNjMwMzkwOH0.RD2wiyXINC1_zrvWwzwWwLb7RZdjYqEzXZ7ePz2-3uk
*/


// const data = await this.commentsRepository
//             .createQueryBuilder("comment")
//             .leftJoinAndMapMany(
//                 "comment.likesComments",
//                 "comment.likesComments",            // Тип связанной сущности
//                 "likesComments",          // Псевдоним для использования в запросе
//                 "likesComments.commentId = comment.id"  // Условие объединения
//             )
//             .getMany();

//         return data;

