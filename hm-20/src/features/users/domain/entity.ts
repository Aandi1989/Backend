import { Comment } from 'src/features/comments/domain/comment.entity';
import { LikesComments, LikesPosts } from 'src/features/likes/domain/likes.entities';
import { Session } from 'src/features/security/domain/entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
    confCodeConfirmed: boolean;

    @Column()
    recoveryCode: string;

    @Column()
    recCodeExpDate: string;

    @Column()
    recCodeConfirmed: boolean; 
    
    //----------------------
    @OneToMany(() => Comment, comment => comment.user)
    comment: Comment[]

    @OneToMany(() => LikesPosts, likesPosts => likesPosts.post)
    likesPosts: LikesPosts[]

    @OneToMany(() => LikesComments, likesComments => likesComments.user)
    likesComments: LikesComments[]

    @OneToMany(() => Session, session => session.user)
    sessions: Session[]
}
