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
    @JoinColumn()
    post: Post;
    @Column()
    postId: string;

    @ManyToOne(() => User, user => user.likesPosts)
    @JoinColumn()
    user: User;
    @Column()
    userId: string; 

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
    @JoinColumn()
    comment:Comment;
    @Column()
    commentId: string

    @ManyToOne(() => User, user => user.likesComments)
    @JoinColumn()
    user: User;
    @Column()
    userId: string;

    @Column()
    createdAt: string; 
}