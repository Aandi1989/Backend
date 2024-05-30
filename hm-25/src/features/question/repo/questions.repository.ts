import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GameQuestion, Question } from "../domain/question.entity";
import { Repository } from "typeorm";
import { QuestionType, UpdateQuestionType } from "../types/types";
import { PublishQuestionDto } from "../api/modules/input/publish-question.dto";

@Injectable()
export class QuestionsRepository {
    constructor(@InjectRepository(Question) private readonly questionsRepository: Repository<Question>,
                @InjectRepository(GameQuestion) private readonly gameQuestionsRepository: Repository<GameQuestion>){}

    async createQuestion(newQuestion: QuestionType): Promise<QuestionType>{
        const result = await this.questionsRepository.save(newQuestion);
        return result;
    }
    async updateQuestion(id: string, data: UpdateQuestionType): Promise<boolean>{
        const questionToUpdate = await this.questionsRepository.findOneBy({id: id});
        if(!questionToUpdate) throw new NotFoundException();
        const updatedQuestionData = {
            ...questionToUpdate,
            ...data
        }
        const result = await this.questionsRepository.save(updatedQuestionData);
        return result ? true : false;
    }
    async publishQuestion(id: string, data: PublishQuestionDto): Promise<boolean>{
        const questionToUpdate = await this.questionsRepository.findOneBy({id: id});
        if(!questionToUpdate) throw new NotFoundException();
        const updatedQuestionData = {
            ...questionToUpdate,
            ...data
        }
        const result = await this.questionsRepository.save(updatedQuestionData);
        return result ? true : false;
    }
    async deleteQuestion(id: string): Promise<boolean>{
        const result = await this.questionsRepository.delete(id);
        return result.affected === 1;
    }
    async deleteAllData(){
        const questionResult = await this.questionsRepository
        .createQueryBuilder()
        .delete()
        .execute()
        const gameQuestionResult = await this.gameQuestionsRepository
        .createQueryBuilder()
        .delete()
        .execute()
    }
}