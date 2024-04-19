import { Blog } from "../../blogs/domain/blog.entity";
import { Comment } from "../../comments/domain/comment.entity";
import { LikesPosts } from "../../likes/domain/likes.entity";
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
    @JoinColumn()
    blog: Blog[]; 
    @Column()
    blogId: string;

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