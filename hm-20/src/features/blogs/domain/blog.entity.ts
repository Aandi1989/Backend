import { Post } from "../../posts/domain/post.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";

@Entity()
export class Blog {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    name: string; 

    @Column()
    description: string; 

    @Column()
    websiteUrl: string; 

    @Column()
    createdAt: string; 

    @Column()
    isMembership: boolean; 

    //----------------
    @OneToMany(() => Post, post => post.blog)
    post: Post[]
}
