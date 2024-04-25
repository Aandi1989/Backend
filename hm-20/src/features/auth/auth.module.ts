import { Module } from "@nestjs/common";
import { CqrsModule } from '@nestjs/cqrs';
import { AuthController } from "./api/auth.controller";
import { AuthQueryRepo } from "./repo/auth.query.repo";
import { AuthRepository } from "./repo/auth.repository";
import { ChangeCodeUseCase } from "./application/use-case/change-code.use-case";
import { CheckCredentialsUseCase } from "./application/use-case/check-credentials.use-case";
import { ConfirmEmailUseCase } from "./application/use-case/confirm-email.use-case";
import { CreateAccountUseCase } from "./application/use-case/create-account.use-case";
import { RecoveryCodeUseCase } from "./application/use-case/recovery-code.use-case";
import { ResendEmailUseCase } from "./application/use-case/resend-email.use-case";
import { UsersModule } from "../users/user.module";
import { JwtService } from "../../common/services/jwt-service";

@Module({
    imports:[CqrsModule, UsersModule],
    providers:[AuthQueryRepo, AuthRepository, ChangeCodeUseCase, CheckCredentialsUseCase,
        ConfirmEmailUseCase, CreateAccountUseCase, RecoveryCodeUseCase, ResendEmailUseCase, JwtService
    ],
    controllers:[AuthController],
    exports: []
})
export class AuthModule {}