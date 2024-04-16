import { Blog } from "src/features/blogs/domain/blog.entity";
import { Comment } from "src/features/comments/domain/comment.entity";
import { LikesPosts } from "src/features/likes/domain/likes.entities";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";

@Entity()
export class Post {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    title: string; 

    @Column()
    shortDescription: string; 

    @Column()
    content: string; 

    @ManyToOne(() => Blog, blog => blog.post)
    @JoinColumn({ name: "blogId" })
    blog: Blog[]; 

    @Column()
    blogName: string; 

    @Column()
    createdAt: string; 

    // -------------
    @OneToMany(() => Comment, comment => comment.post)
    comment: Comment[]

    @OneToMany(() => LikesPosts, likesPosts => likesPosts.post)
    likesPosts: LikesPosts[]
}