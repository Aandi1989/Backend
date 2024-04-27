import { LikesComments } from "../../likes/domain/likes.entity";
import { Post } from "../../posts/domain/post.entity";
import { User } from "../../users/domain/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    content: string; 

    @ManyToOne(() => Post, post => post.comment)
    @JoinColumn()
    post: Post; 
    @Column()
    postId: string;

    @ManyToOne(() => User, user => user.comment)
    @JoinColumn()
    user: User; 
    @Column()
    userId: string;

    @Column()
    createdAt: string; 

    // -------------
    @OneToMany(() => LikesComments, likesComments => likesComments.comment)
    likesComments: LikesComments[]
}

