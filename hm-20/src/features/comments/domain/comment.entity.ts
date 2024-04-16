import { LikesComments } from "src/features/likes/domain/likes.entities";
import { Post } from "src/features/posts/domain/entity";
import { User } from "src/features/users/domain/entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    content: string; 

    @ManyToOne(() => Post, post => post.comment)
    @JoinColumn({ name: "postId" })
    post: Post; 

    @ManyToOne(() => User, user => user.comment)
    @JoinColumn({ name: "userId" })
    user: User; 

    @Column()
    createdAt: string; 

    // -------------
    @OneToMany(() => LikesComments, likesComments => likesComments.comment)
    likesComments: LikesComments[]
}
