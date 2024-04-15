import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    login: string;

    @Column()
    email: string;

    @Column()
    passwordHash: string;

    @Column()
    passwordSalt: string;

    @Column()
    createdAt: string;

    @Column()
    confirmationCode: string;

    @Column()
    confCodeExpDate: string;

    @Column()
    confCodeConfirmed: string;

    @Column()
    recoveryCode: string;

    @Column()
    recCodeExpDate: string;

    @Column()
    recCodeConfirmed: string; 
    
    //----------------------
    @OneToMany(() => Comment, comment => comment.user)
    comment: Comment[]
}


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
}


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
     

    @Column()
    createdAt: string; 
}

@Entity()
export class LikesComments {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    status: string; 

    @Column("uuid")
    commentId: string; 

    @Column("uuid")
    userId: string; 

    @Column()
    createdAt: string; 
}


@Entity()
export class Session {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column("uuid")
    userId: string; 

    @Column()
    iat: string; 

    @Column("uuid")
    deviceId: string; 

    @Column()
    deviceName: string; 

    @Column()
    ip: string; 

    @Column()
    exp: string; 
}