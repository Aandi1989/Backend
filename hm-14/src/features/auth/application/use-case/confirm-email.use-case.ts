import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AuthBodyModel } from "../../api/models/input/login.input.model";



export class ConfirmEmailCommand {
    constructor(public data: AuthBodyModel){}
}

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailUseCase implements ICommandHandler<ConfirmEmailCommand>{
    constructor(){}

    async execute(command: ConfirmEmailCommand): Promise<any> {
        
    }
}