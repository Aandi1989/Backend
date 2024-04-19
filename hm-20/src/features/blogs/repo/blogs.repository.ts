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
Jan:  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMjJkMjkwMi1mZTE1LTQ1N2UtOTJkYS1lMzI5MzI2N2I2ZTQiLCJpYXQiOjE3MTI5MzE4MDQsImV4cCI6MTcxNTYxMDIwNH0.UYSx026U3TH_Fu3BHkLOEuMGmHCgEqo2sEXS55-b1ng
John: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyMWFlNGUzNy1jN2I3LTQ1MzQtOTYzZS0xOTU2MDkwMmM0OTkiLCJpYXQiOjE3MTI5Mjg5OTMsImV4cCI6MTcxNTYwNzM5M30.S_d1MO5DsLdFKRD-92vHzrVcrwvMmB6hiavxQF3BnJI
Anna: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ZWYyZDVmYy1kODExLTRhYzAtOWEwZS03YzljZGEwODEyMmMiLCJpYXQiOjE3MTI5MzE4MzksImV4cCI6MTcxNTYxMDIzOX0.j50dDufNNN_O5_VyWd12MHFUf3KRukYmW_-CRy2Nnwc
Fabi: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0MDg4Y2UxOS0wZDlhLTRlMzEtOTY0NS1lYTk3OWFjMTE2ZWYiLCJpYXQiOjE3MTI5MzE4ODUsImV4cCI6MTcxNTYxMDI4NX0.W5HgISir--rHNfGR0N-retp6xzQq_S6jaeEYpC90j30
*/
