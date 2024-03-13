import express, { Request, Response } from "express";
import { securityQueryRepo } from "../../repositories/securityQueryRepository";
import { RequestWithParams, ResultCode } from "../../types/types";
import { URIParamsDeviceIdModel } from "./Models/URIParamsDeviceId";
import { securityService } from "../../domain/security-service";
import { HTTP_STATUSES } from "../../utils";


export const getSecurityRouter = () => {
    const router = express.Router();
    router.get('/devices', async(req: Request, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        const sessions = await securityQueryRepo.getSessions(refreshToken);
        if(sessions) return res.status(HTTP_STATUSES.OK_200).send(sessions);
        return res.send(HTTP_STATUSES.UNAUTHORIZED_401);
    }),
    router.delete('/devices/:id', async (req:RequestWithParams<URIParamsDeviceIdModel>, res: Response) => {
        const refreshToken = req.cookies.refreshToken;
        const result = await securityService.checkRefreshToken(refreshToken, req.params.id);
        if(result.code === ResultCode.Forbidden) return res.send(HTTP_STATUSES.ACCESS_FORBIDDEN_403)
        if(result.code === ResultCode.Failed) return res.send(HTTP_STATUSES.UNAUTHORIZED_401)
        if(result.code === ResultCode.NotFound) return res.send(HTTP_STATUSES.NOT_FOUND_404)
        if(result.code === ResultCode.Success){
            const deletedDevice = await securityService.deleteDevice(req.params.id);
            return res.send(HTTP_STATUSES.NO_CONTENT_204)
        }
        return res.send(HTTP_STATUSES.NOT_FOUND_404)
    })

    return router;
}