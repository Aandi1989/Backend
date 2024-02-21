import { NextFunction, Request, Response } from "express";

export const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).send('Unauthorized');
    }

    const authName = authHeader.split(' ')[0];
    if(authName !== 'Basic'){
        return res.status(401).send('Unauthorized');
    }
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');


    if (username !== 'admin' || password !== 'qwerty') {
        return res.status(401).send('Unauthorized');
    }

    
    next();
};