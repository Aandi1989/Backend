import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Question } from '../domain/question.entity';
import { QuestionsWithQueryOutputModel } from '../api/modules/output/questionPagination.output.model';
import { QuestionQueryOutputType } from '../types/types';

@Injectable()
export class QuestionsQueryRepo {
    constructor(@InjectRepository(Question) private readonly questionsRepository: Repository<Question>) { }
    async getQuestions(query: QuestionQueryOutputType): Promise<QuestionsWithQueryOutputModel> {
        let { pageNumber, pageSize, bodySearchTerm, publishedStatus, sortBy, sortDirection } = query;
        const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
        const offset = (pageNumber - 1) * pageSize;
        
        let queryBulderCount = this.questionsRepository
            .createQueryBuilder("question")
            .where([{body: ILike (`%${bodySearchTerm}%`)}]);
        if(publishedStatus !== "all"){
            let status = publishedStatus === "published" ? true : false;
            queryBulderCount = queryBulderCount.andWhere("question.published = :status", {status})
        }
        const totalCount = await queryBulderCount.getCount();

        let queryBulder = this.questionsRepository
            .createQueryBuilder("question")
            .where([{body: ILike (`%${bodySearchTerm}%`)}]);
        if(publishedStatus !== "all"){
            let status = publishedStatus === "published" ? true : false;
            queryBulderCount = queryBulder.andWhere("question.published = :status", {status})
        }
        const questions = await queryBulder
            .orderBy(`question.${sortBy}`, sortDir)
            .limit(pageSize)
            .offset(offset)
            .getMany();

        const pagesCount = Math.ceil(totalCount / pageSize);
        return {
            pagesCount: pagesCount,
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: questions
        }
    }
}
