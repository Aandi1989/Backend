import { Module } from "@nestjs/common";
import { SecurytyController } from "./api/security.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session } from "./domain/session.entity";
import { CheckRefreshTokenUseCase } from "./application/use-case/check-refreshToken.use-case";
import { CheckSecurityRefreshTokenUseCase } from "./application/use-case/check-security-refreshToken.use-case.";
import { CreateSessionUseCase } from "./application/use-case/create-session.use-case";
import { RevokeSessionUseCase } from "./application/use-case/revoke-session.use-case";
import { RevokeSessionsUseCase } from "./application/use-case/revoke-sessions.use-case";
import { SecurityQueryRepo } from "./repo/security.query.repository";
import { SecurityRepository } from "./repo/security.repository";
import { JwtService } from "../../common/services/jwt-service";
import { CqrsModule } from '@nestjs/cqrs';
import { RefreshTokensUseCase } from "./application/use-case/refresh-tokens.use-case";

@Module({
    imports: [TypeOrmModule.forFeature([Session]), CqrsModule],
    providers: [SecurityQueryRepo, SecurityRepository, CheckRefreshTokenUseCase, 
        CheckSecurityRefreshTokenUseCase,CreateSessionUseCase, RevokeSessionUseCase, 
        RevokeSessionsUseCase, RefreshTokensUseCase ,JwtService
    ],
    controllers: [SecurytyController],
    exports: [SecurityRepository]
})
export class SessionsModule {}