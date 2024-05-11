import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { HTTP_STATUSES, RouterPaths } from "../../../common/utils/utils";
import { CommandBus } from "@nestjs/cqrs";
import { BasicAuthGuard } from "../../../common/guards/basicAuth";
import { CreateQuestionDto } from "./modules/input/create-question.dto";
import { QuestionOutputModel } from "./modules/output/question.output.model";
import { CreateQuestionCommand } from "../application/use-case/create-question.use-case";
import { DeleteQuestionCommand } from "../application/use-case/delete-question.use-case";
import { UpdateQuestionCommand } from "../application/use-case/update-question.use-case";
import { PublishQuestionDto } from "./modules/input/publish-question.dto";
import { PublishQuestionCommand } from "../application/use-case/publish-question.use-case";
import { QuestionQueryType } from "../types/types";
import { QuestionsQueryRepo } from "../repo/questions.query.repository";
import { questionQueryParams } from "../../../common/helpers/queryStringModifiers";
import { QuestionsWithQueryOutputModel } from "./modules/output/questionPagination.output.model";

@Controller(RouterPaths.quizQuestion)
export class QuestionsSAController {
    constructor(private commandBus: CommandBus,
                protected questionsQueryRepo: QuestionsQueryRepo
    ){}
    @UseGuards(BasicAuthGuard)
    @Get()
    async getQuestions(@Query() query: Partial<QuestionQueryType>): Promise<QuestionsWithQueryOutputModel>{
        return await this.questionsQueryRepo.getQuestions(questionQueryParams(query))
    }
    @UseGuards(BasicAuthGuard)
    @Post()
    async createQuestion(@Body() body: CreateQuestionDto): Promise<QuestionOutputModel>{
        return await this.commandBus.execute(new CreateQuestionCommand(body))
    }
    @UseGuards(BasicAuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Put(':id')
    async updateQuestion(@Param('id') questionId: string, @Body() body: CreateQuestionDto){
        const isUpdated = await this.commandBus.execute(new UpdateQuestionCommand(questionId, body));
        if(isUpdated) return;  
        throw new NotFoundException('Question not found');
    }
    @UseGuards(BasicAuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Put(':id/publish')
    async publishQuestion(@Param('id') questionId: string, @Body() body: PublishQuestionDto){
        const isUpdated = await this.commandBus.execute(new PublishQuestionCommand(questionId, body));
        if(isUpdated) return;  
        throw new NotFoundException('Question not found');
    }
    @UseGuards(BasicAuthGuard)
    @HttpCode(HTTP_STATUSES.NO_CONTENT_204)
    @Delete(':id')
    async deleteQuestion(@Param('id') questionId: string){
        const isDeleted = await this.commandBus.execute(new DeleteQuestionCommand(questionId));
        if(isDeleted) return;
        throw new NotFoundException('Question not found');
    }
}