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



// запрос выполняется с вложенностью но только если удалить строку с SELECT COUNT(*)
// async getPostById(id: string, userId: string = ''): Promise<any> {
//     const result = await this.postRepository
//         .createQueryBuilder("post")
//         .select([`post.*,
//         (SELECT COUNT(*) from "likes_posts" where "likes_posts"."postId" = post.id AND "status" = 'Like') AS "likesCount"
//         `])
//         .leftJoinAndMapMany(
//             "post.newestLikes",
//             "post.likesPosts",
//             "likesPosts",
//             "likesPosts.postId = post.id AND likesPosts.status = 'Like' "
//         )
//         .where("post.id = :id", {id})
//         .orderBy(`likesPosts.createdAt`, 'DESC')
//         .limit(3)
//         .getOne();
    
//     return result;


// запрос выполниться за всеми постами и заджойнит userLogin но непонятно как ограничить получение лайков тремя штуками
// async getPostById(id: string, userId: string = ''): Promise<any> {
//     const result = await this.postRepository
//         .createQueryBuilder("post")
//         .select([`post.id`])
//         .leftJoinAndMapMany(
//             "post.newestLikes",
//             "post.likesPosts",
//             "likesPosts",
//             `likesPosts.postId = post."id" AND likesPosts.status = 'Like' `
//         )
//         .leftJoin("likesPosts.user", "user")
//         .addSelect("user.login")
//         .orderBy(`likesPosts.createdAt`, 'DESC')
//         .limit(3)
//         .getMany();
    
//     return result;
// }

/*
запрос заджойнит посты к пост_лайкам но неясно как добиться учета постов с одинаковым id как одной единицы
async getPostById(id: string, userId: string = ''): Promise<any> {
        const result = await this.postRepository
            .createQueryBuilder("post")
            .select()
            .leftJoinAndSelect(
                subQuery => {
                    return subQuery
                        .select()
                        .from("likes_posts", "likes_posts")
                        .orderBy(`likes_posts."createdAt"`, "ASC")
                        .limit(3)
                },
                "likes_posts",
                `likes_posts."postId" = post.id `
            )
            .limit(4)
            .getRawMany()
        
        return result;
   }

   попытка начать джойнить от пользователей
   const result = await this.userRepository
            .createQueryBuilder("user")
            .select(`user.login`)
            .leftJoinAndSelect(
                subQuery => {
                    return subQuery
                        .select()
                        .from("likes_posts", "likes_posts")
                        .orderBy(`likes_posts."createdAt"`, "ASC")
                        .limit(100)
                },
                "likes_posts",
                `likes_posts."userId" = user.id`
            )
            .leftJoinAndSelect(
                subQuery => {
                    return subQuery
                        .select()
                        .from("post", "post")
                        .orderBy(`post."createdAt"`, "ASC")
                        .limit(20)
                },
                "post",
                `post."id" = likes_posts."postId"`
            )
            .getRawMany()
        
            return result;

возвращение null вместо информации о лайке для одного поста
 async getPosts(query: PostQueryOutputType, userId: string = ''): Promise<any> {
        const { pageNumber, pageSize, sortBy, sortDirection } = query;
        const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
        const offset = (pageNumber - 1) * pageSize;

        const totalCount = await this.postRepository
            .createQueryBuilder("post")
            .getCount();

            const postsIds = await this.postRepository
            .createQueryBuilder("post")
            .select("post.id")
            .orderBy(`post.${sortBy}`, sortDir)
            .groupBy("post.id")
            .limit(pageSize)
            .offset(offset)
            .getRawMany();
    
            const ids = postsIds.map(entry => entry.post_id);
    
            const result = await this.postRepository
                .createQueryBuilder("post")
                .select(["post", "user.login",
                    `(select COUNT(*) from "likes_posts" where "likes_posts"."postId" = post."id" AND "status" = 'Like') AS "likesCount"`
                ])
                .leftJoinAndSelect(
                    subQuery => {
                        return subQuery
                            .select()
                            .from("likes_posts", "likes_posts")
                            .orderBy(`likes_posts."createdAt"`, "ASC")
                            .limit(3)
                    },
                    "likes_posts",
                    `likes_posts."postId" = post.id `
                )
                .leftJoin("user", "user", `user.id = likes_posts."userId"`)
                .where('post.id IN (:...ids)', { ids })
                .orderBy(`post.${sortBy}`, sortDir)
                .getRawMany()

            const pagesCount = Math.ceil(totalCount / pageSize);
            return result;
    }
*/ 
