import { Router } from "express";
import { container } from "../../composition-root";
import { SecurityController } from "../../controllers/securityController";

const securityController = container.resolve(SecurityController)

export const securityRouter = Router();


securityRouter.get('/devices', securityController.getSessions.bind(securityController))
securityRouter.delete('/devices/:id', securityController.deleteSession.bind(securityController))
securityRouter.delete('/devices', securityController.deleteSessions.bind(securityController))
   