import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../domain/auth-service';
import { AuthQueryRepo } from '../repositories/authQueryRepository';
import { HTTP_STATUSES } from '../utils';
import { container } from '../composition-root';

const authService = container.resolve(AuthService);
const authQueryRepo = container.resolve(AuthQueryRepo);

export const apiCallsGuard = async (req: Request, res: Response, next: NextFunction) => {
    const currentDateMinus10Sec = new Date(Date.now() - 10000);

    const newRequest = {
        ip: req.ip!,
        url: req.originalUrl,
        date: new Date()
    }

    const addedRequest = await authService.addRequest(newRequest);
    const count = await authQueryRepo.countRequests(newRequest, currentDateMinus10Sec);
    
    if(count > 5){
        return res.sendStatus(HTTP_STATUSES.TO_MANY_REQUESTS_429);
    }
    
    next();
}