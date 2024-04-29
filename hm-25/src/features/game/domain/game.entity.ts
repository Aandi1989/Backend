import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { GameQuestion } from "../../question/domain/question.entity";

@Entity()
export class Game {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column({ type: "uuid", nullable: true})
    firstUserId: string;

    @Column({type:"uuid", nullable: true})
    secondUserId: string;

    @Column()
    status: string;

    @Column()
    pairCreatedDate: string;

    @Column({nullable: true})
    startGameDate: string;

    @Column({nullable: true})
    finishGameDate: string;

    @Column({type:"uuid", nullable: true})
    winnerId: string;

    @Column({type:"uuid", nullable: true})
    loserId: string;

    @Column({default: 0, nullable: false})
    firstUserScore: number;

    @Column({default: 0, nullable: false})
    secondUserScore: number;

    @Column({default: 0, nullable: false})
    amountOfFinishedGame: number;

    //---------------------------
    @OneToMany(() => Answer, answer => answer.game)
    answer: Answer[]

    @OneToMany(() => GameQuestion, gq => gq.game)
    gameQuestion: GameQuestion[]
}

@Entity()
export class Answer {
    @PrimaryGeneratedColumn("uuid")
    id: string;  

    @ManyToOne(() => Game, game => game.answer)
    @JoinColumn({ name: "gameId" })
    game:Game;
    @Column()
    gameId: string;

    @Column()
    playerId: string;

    @Column()
    questionId:string;

    @Column()
    answerStatus: string;

    @Column()
    addedAt: string;

    @Column()
    sequence: number;
}