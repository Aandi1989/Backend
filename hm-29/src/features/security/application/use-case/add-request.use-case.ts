import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SecurityRepository } from "../../repo/security.repository";
import { ApiCallModel } from "../../api/models/input/api-call.input.model";



export class AddRequestCommand {
    constructor(public apiCall: ApiCallModel){}
}

@CommandHandler(AddRequestCommand)
export class AddRequestUseCase implements ICommandHandler<AddRequestCommand>{
    constructor(protected securityRepository: SecurityRepository) { }
  
    async execute(command: AddRequestCommand) {
        const addedRequest = await this.securityRepository.addRequest(command.apiCall);
        return addedRequest;
    }
  }