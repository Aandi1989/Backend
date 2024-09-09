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
}