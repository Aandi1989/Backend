import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, Post, Put, Query, Req, Res, UseGuards } from "@nestjs/common";
import { RouterPaths } from "../../../common/utils/utils";
import { CommandBus } from "@nestjs/cqrs";
import { BasicAuthGuard } from "../../../common/guards/basicAuth";
import { CreateQuestionDto } from "./modules/input/create-question.dto";
import { QuestionOutputModel } from "./modules/output/question.output.model";

@Controller(RouterPaths.quizQuestion)
export class QuestionsSAController {
    constructor(private commandBus: CommandBus){}
    @UseGuards(BasicAuthGuard)
    @Post()
    //                                                             QuestionOutputModel
    async createQuestion(@Body() body: CreateQuestionDto): Promise<any>{
        return await this.commandBus.execute(new CreateQuestionCommand(body))
    }
}