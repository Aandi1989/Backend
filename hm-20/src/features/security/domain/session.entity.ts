import { User } from "../../users/domain/user.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";

@Entity()
export class Session {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @ManyToOne(() => User, user => user.sessions)
    @JoinColumn({name: "userId"})
    user: User;

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