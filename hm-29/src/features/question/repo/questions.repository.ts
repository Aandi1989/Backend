import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource,  } from "typeorm";
import { QuestionType, UpdateQuestionType } from "../types/types";
import { PublishQuestionDto } from "../api/modules/input/publish-question.dto";

@Injectable()
export class QuestionsRepository {
    constructor(@InjectDataSource() private readonly dataSource: DataSource){}
    
    async createQuestion(newQuestion: QuestionType): Promise<QuestionType>{
        const { body, correctAnswers, createdAt, id, published, updatedAt } = newQuestion;
        const correctAnswersStr = JSON.stringify(correctAnswers);
        const query = `
            INSERT INTO public."Question"(
                "id", "body", "published", "createdAt", "correctAnswers")
                VALUES ('${id}', '${body}', '${published}', '${createdAt}', '${correctAnswersStr}')
                RETURNING *;
        `;
        const result = await this.dataSource.query(query);
        return result[0];
    };

    async updateQuestion(id: string, data: UpdateQuestionType): Promise<boolean>{
        const { body, correctAnswers, updatedAt } = data;
        const correctAnswersStr = JSON.stringify(correctAnswers);

        const query = 
                `UPDATE public."Question" 
                SET ` +
                (body ? `"body"='${body}' ` : '') +
                (correctAnswersStr ? `, "correctAnswers"='${correctAnswersStr}'` : '') +
                (updatedAt ? `, "updatedAt"='${updatedAt}' ` : '') +
                `WHERE "id" = $1`;
        const result = await this.dataSource.query(query, [id]);
        return result[1] === 1;
    }
    
     async publishQuestion(id: string, data: PublishQuestionDto): Promise<boolean>{
       const { published } = data;
       const updatedAt = new Date().toISOString();
       const query = 
            `UPDATE public."Question"
            SET "updatedAt"='${updatedAt}' ` +
            (published ? `, "published"='${published}'` : '') +
            `WHERE "id" = $1`;
       const result = await this.dataSource.query(query, [id]);
       return result[1] === 1;
    }
    
    async deleteQuestion(id: string): Promise<boolean>{
        const query = 
        `DELETE FROM public."Question"
        WHERE "id" = $1`;
        const result = await this.dataSource.query(query, [id]);
        return result[1] === 1;
    }

    async generateGameQuestions(gameId: string):  Promise<boolean>{
        const query = `
            WITH RandomQuestions AS (
                SELECT id, row_number() OVER (ORDER BY RANDOM()) AS sequence
                FROM public."Question"
                WHERE "published" = true
                ORDER BY RANDOM()
                LIMIT 5
            )
            INSERT INTO public."Game_question" ("id", "gameId", "questionId", "sequence")
            SELECT uuid_generate_v4(), '${gameId}', id, sequence
            FROM RandomQuestions;
            `;
        const result = await this.dataSource.query(query);
        return result[1] === 1;
    }

    async deleteAllData(){
        const questionQuery = `DELETE FROM public."Question"`;
        const queryGameQuestions = `DELETE FROM public."Game_question"`;
        const queryGames = `DELETE FROM public."Game"`;
        const queryAnswer = `DELETE FROM public."Answer"`;
        const queryWaitingUser = `DELETE FROM public."User_waiting_for_game"`;

        await this.dataSource.query(queryGameQuestions);  
        await this.dataSource.query(queryAnswer);        
        await this.dataSource.query(queryGames);          
        await this.dataSource.query(questionQuery);      
        await this.dataSource.query(queryWaitingUser)
    }
}