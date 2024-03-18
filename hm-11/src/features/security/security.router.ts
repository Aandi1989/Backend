import { Request, Response, Router } from "express";
import { SecurityService } from "../../domain/security-service";
import { SecurityQueryRepo } from "../../repositories/securityQueryRepository";
import { RequestWithParams, ResultCode } from "../../types/types";
import { HTTP_STATUSES } from "../../utils";
import { URIParamsDeviceIdModel } from "./Models/URIParamsDeviceId";

export const securityRouter = Router();

class SecurityController {
    securityService: SecurityService;
    securityQueryRepo: SecurityQueryRepo;
    constructor(){
        this.securityService = new SecurityService(),
        this.securityQueryRepo = new SecurityQueryRepo()
    }
    async getSessions (req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const result = await this.securityService.checkRefreshToken(refreshToken);
        if(result.code != ResultCode.Success) return res.send(HTTP_STATUSES.UNAUTHORIZED_401)
        const sessions = await this.securityQueryRepo.getSessions(refreshToken);
        if(sessions) return res.status(HTTP_STATUSES.OK_200).send(sessions);
        return res.send(HTTP_STATUSES.UNAUTHORIZED_401);
    }
    async deleteSession (req:RequestWithParams<URIParamsDeviceIdModel>, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const result = await this.securityService.checkRefreshToken(refreshToken, req.params.id);
        if(result.code === ResultCode.Forbidden) return res.send(HTTP_STATUSES.ACCESS_FORBIDDEN_403)
        if(result.code === ResultCode.Failed) return res.send(HTTP_STATUSES.UNAUTHORIZED_401)
        if(result.code === ResultCode.NotFound) return res.send(HTTP_STATUSES.NOT_FOUND_404)
        const deletedDevice = await this.securityService.revokeSession(req.params.id);
        return res.send(HTTP_STATUSES.NO_CONTENT_204);
    }
    async deleteSessions (req: Request, res: Response) {
        const refreshToken = req.cookies.refreshToken;
        const result = await this.securityService.checkRefreshToken(refreshToken);
        if(result.code != ResultCode.Success) return res.send(HTTP_STATUSES.UNAUTHORIZED_401)
        const deletedDevices = await this.securityService.revokeSessions(refreshToken);
        return res.send(HTTP_STATUSES.NO_CONTENT_204);
    }
}

const securityController = new SecurityController();

securityRouter.get('/devices', securityController.getSessions.bind(securityController))
securityRouter.delete('/devices/:id', securityController.deleteSession.bind(securityController))
securityRouter.delete('/devices', securityController.deleteSessions.bind(securityController))
   