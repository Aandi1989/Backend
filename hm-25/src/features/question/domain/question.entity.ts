import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Game } from "../../game/domain/game.entity";

@Entity()
export class Question {
    @PrimaryGeneratedColumn("uuid")
    id:string;

    @Column()
    body: string;

    @Column({type: 'json', nullable: false})
    correctAnswers: (string | number)[];

    @Column()
    published: boolean;

    @Column()
    createdAt: string;

    @Column()
    updatedAt: string;

    //---------------
    @OneToMany(() => GameQuestion, gq => gq.question)
    gameQuestion: GameQuestion[];
}

@Entity()
export class GameQuestion {
    @PrimaryGeneratedColumn("uuid")
    id: string; 

    @ManyToOne(() => Game, game => game.gameQuestion)
    @JoinColumn({ name: "gameId" })
    game:Game;
    @Column()
    gameId:string;
    
    @ManyToOne(() => Question, question => question.gameQuestion)
    @JoinColumn({ name: "questionId" })
    question: Question;
    @Column()
    questionId:string;

    @Column()
    sequence: number;
}