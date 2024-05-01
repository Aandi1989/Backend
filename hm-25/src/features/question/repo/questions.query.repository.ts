import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Question } from '../domain/question.entity';
import { QuestionsWithQueryOutputModel } from '../api/modules/output/questionPagination.output.model';
import { QuestionQueryOutputType } from '../types/types';

@Injectable()
export class QuestionsQueryRepo {
    constructor(@InjectRepository(Question) private readonly questionsRepository: Repository<Question>) { }
    //                                                  QuestionsWithQueryOutputModel
    async getQuestions(query: QuestionQueryOutputType): Promise<any> {
        const { pageNumber, pageSize, bodySearchTerm, publishedStatus, sortBy, sortDirection } = query;
        const sortDir = sortDirection === "asc" ? "ASC" : "DESC";
        const offset = (pageNumber - 1) * pageSize;
        const isPublished = definePublishStatus(publishedStatus);

        
       

        const totalCount = await this.questionsRepository
        .createQueryBuilder("questions")
        .where([{body: ILike (`%${bodySearchTerm}%`)}])
        // .andWhere(isPublished)
        .andWhere('')
        .getCount();

        return totalCount;
    }
}

function definePublishStatus(publishedStatus: string){
    let status;
    if(publishedStatus === "all"){ 
        return status = "question.published IS TRUE OR question.published IS FALSE";
     }else{
        return status = `"question.published = :isPublished", { ${publishedStatus}}`
     }
}
