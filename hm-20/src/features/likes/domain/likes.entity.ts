import { Comment } from "../../comments/domain/comment.entity";
import { Post } from "../../posts/domain/post.entity";
import { User } from "../../users/domain/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";

@Entity()
export class LikesPosts {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    status: string; 

    @ManyToOne(() => Post, post => post.likesPosts)
    @JoinColumn({name: "postId"})
    post: Post;

    @ManyToOne(() => User, user => user.likesPosts)
    @JoinColumn({name: "userId"})
    user: User 

    @Column()
    createdAt: string; 
}

@Entity()
export class LikesComments {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    status: string; 

    @ManyToOne(() => Comment, comment => comment.likesComments)
    @JoinColumn({name: "commentId"})
    comment:Comment;

    @ManyToOne(() => User, user => user.likesComments)
    @JoinColumn({name: "userId"})
    user: User;

    @Column()
    createdAt: string; 
}