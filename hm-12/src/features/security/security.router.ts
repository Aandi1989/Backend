import { Router } from "express";
import { securityController } from "../../composition-root";


export const securityRouter = Router();


securityRouter.get('/devices', securityController.getSessions.bind(securityController))
securityRouter.delete('/devices/:id', securityController.deleteSession.bind(securityController))
securityRouter.delete('/devices', securityController.deleteSessions.bind(securityController))
   