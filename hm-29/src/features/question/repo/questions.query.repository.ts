import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { QuestionsWithQueryOutputModel } from '../api/modules/output/questionPagination.output.model';
import { QuestionQueryOutputType } from '../types/types';

@Injectable()
export class QuestionsQueryRepo {
    constructor(@InjectDataSource() private readonly dataSource: DataSource) { }
    async getQuestions(query: QuestionQueryOutputType): Promise<QuestionsWithQueryOutputModel> {
        let { pageNumber, pageSize, bodySearchTerm, publishedStatus, sortBy, sortDirection } = query;
        const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
        const offset = (pageNumber - 1) * pageSize;
        const searchBodyParam = bodySearchTerm ? `%${bodySearchTerm}%` : `%%`;

        let totalCountQuery = `
            SELECT COUNT(*)
            FROM public."Question"
            WHERE body ILIKE $1
        `;

        // Add the published status condition if applicable
        let totalCountParams: any = [searchBodyParam];
        if (publishedStatus !== "all") {
            totalCountQuery += ` AND published = $2`;
            totalCountParams.push(publishedStatus === "published");
        }

        // Execute the count query
        const totalCountResult = await this.dataSource.query(totalCountQuery, totalCountParams);
        const totalCount = parseInt(totalCountResult[0].count);

        // Build the main query
        let mainQuery = `
            SELECT * FROM public."Question"
            WHERE body ILIKE $1
        `;

        // Add the published status condition if applicable
        if (publishedStatus !== "all") {
            mainQuery += ` AND published = $4`;
        }

        mainQuery += `
            ORDER BY "${sortBy}" ${sortDir}
            LIMIT $2
            OFFSET $3
        `;

        const mainQueryParams: any = [searchBodyParam];
        mainQueryParams.push(pageSize, offset);

        if (publishedStatus !== "all") {
            mainQueryParams.push(publishedStatus === "published");
        }

        // Execute the main query
        const questions = await this.dataSource.query(mainQuery, mainQueryParams);
        const pagesCount = Math.ceil(totalCount / pageSize);

        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: questions
        };
    }

    async getCorrectAnswer(gameId: string, sequence: number){
        const query = `
            SELECT q."correctAnswers", q.id 
            FROM public."Game_question" as gq
            LEFT JOIN  public."Question" as q
            ON q.id = gq."questionId"
            WHERE gq."gameId" = '${gameId}' AND gq.sequence = '${sequence}'
        `;
        const result = await this.dataSource.query(query);
        return {correctAnswers: result[0].correctAnswers, questionId: result[0].id};
    }

    async getQuestionsOfGame(gameId: string){
        const query = `
            SELECT gq."sequence", q."id", q."body"
            FROM public."Game_question" as gq
            LEFT JOIN public."Question" as q
            ON q.id = gq."questionId"
            WHERE gq."gameId" = '${gameId}'
            ORDER BY gq."sequence" ASC
        `;
        const result = await this.dataSource.query(query);
        return result;
    }

    async getQuestionsByGameIds(ids: string[]){
        const query = `
            SELECT gq."sequence", q."id", q."body", gq."gameId"
            FROM public."Game_question" as gq
            LEFT JOIN public."Question" as q
            ON q.id = gq."questionId"
            WHERE gq."gameId" = ANY($1)
        `;
        const result = await this.dataSource.query(query, [ids]);
        return result;
    }
}
