import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
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
                "id", "body", "published", "createdAt", "updatedAt", "correctAnswers")
                VALUES ('${id}', '${body}', '${published}', '${createdAt}', '${updatedAt}', '${correctAnswersStr}')
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
       const query = 
            `UPDATE public."Question"
            SET ` +
            (published ? ` "published"='${published}'` : '') +
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

    async deleteAllData(){
        const questionQuery = `DELETE FROM public."Question"`;
        const questionDelete = this.dataSource.query(questionQuery);

        const queryGameQuestions = `DELETE FROM public."Game_question"`;
        const gameQuestionDelete = this.dataSource.query(queryGameQuestions);

        await Promise.all([questionDelete, gameQuestionDelete])
    }
}