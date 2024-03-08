import { appConfig } from '../config';
import {app} from './app';
import { runDb } from './db/db';


const startApp = async () => {
    await runDb()
    app.listen(appConfig.PORT, () => {
        console.log(`Example app listening on port: ${appConfig.PORT}`)
    })
}

startApp()


// in bin folder  D:\Studying\mongodb\bin>mongod.exe --dbpath .\data\db
// in mongoshell folder after double click on mongosh.exe mongodb://localhost
// Стандартный URI для базы данных MongoDB на локальном компьютере обычно имеет следующий формат:mongodb://localhost:27017/<имя_базы_данных>
// в командной строке из рабочего стола D:\Studying\mongodb\bin\mongod.exe --dbpath .\data\db


/*
export const accessTokenGuard = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

    const token = req.headers.authorization.split(' ')[1];
    const jwtObj = await jwtService.getUserIdByToken(token);

    if (jwtObj) {
        const user = await usersQueryRepo.getUserById(jwtObj.userId);
        if (!user) return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);

        // Проверяем срок действия токена
        const tokenExpiration = jwtObj.exp * 1000; // Время действия токена в миллисекундах
        const currentTime = Date.now();
        if (currentTime > tokenExpiration) {
            // Токен истек, пытаемся обновить его
            const refreshToken = req.cookies.refreshToken; // Предполагается, что refreshToken хранится в cookies
            const newAccessToken = await refreshTokenService.refreshAccessToken(refreshToken);

            if (newAccessToken) {
                // Обновление токена прошло успешно, устанавливаем новый accessToken
                req.headers.authorization = `Bearer ${newAccessToken}`;

                // Обновляем refreshToken и сохраняем его в cookies
                const newRefreshToken = await refreshTokenService.refreshRefreshToken(refreshToken);
                res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: refreshTokenMaxAge }); // refreshTokenMaxAge - время жизни refreshToken в миллисекундах
            } else {
                // Не удалось обновить токен, возвращаем ошибку
                return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
            }
        }

        req.user = user;
        return next();
    }
    return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
};
*/ 


/*
export const login = async (req: Request, res: Response) => {
    // Ваша логика проверки учетных данных пользователя
    const user = await authService.login(req.body.login, req.body.password);

    if (!user) {
        return res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }

    // Генерируем accessToken
    const accessToken = jwtService.generateAccessToken(user);

    // Устанавливаем accessToken в заголовке Authorization
    res.setHeader('Authorization', `Bearer ${accessToken}`);

    // Возвращаем пользователю успешный статус и информацию о пользователе
    return res.status(HTTP_STATUSES.OK_200).json({ user });
};
*/
