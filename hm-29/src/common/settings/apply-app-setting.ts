import { BadRequestException, INestApplication, ValidationPipe } from "@nestjs/common";
import * as cookieParser from 'cookie-parser';
import { ErrorType } from "../types/types";
import { HttpExceptionFilter } from "../exeption-filters/exception.filter";

export const applyAppSettings = (app: INestApplication) => {
    app.use(cookieParser());

    app.useGlobalPipes(new ValidationPipe({
        // used to transform uri params into number where it's nessesary without using ParseIntPipe
        // transform: true,
        // used to stop at first error
        stopAtFirstError: true,
        // this logic written for returnin name of the field where our mistake occurs
        exceptionFactory: (errors) => {
          const errorsForResponse: ErrorType[] = [];
          errors.forEach((e) => {
            const constraintKeys = Object.keys(e.constraints!);
            constraintKeys.forEach((ckey) => {
              errorsForResponse.push({
                message: e.constraints![ckey],
                field: e.property
              })
            })
          })
          throw new BadRequestException(errorsForResponse)
        }
        //--------------------
      }));

    app.enableCors();
    app.useGlobalFilters(new HttpExceptionFilter());
}


// import {INestApplication,} from '@nestjs/common';
// import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
// import configuration from './configuration';

// // Префикс нашего приложения (http://site.com/api)
// const APP_PREFIX = '/api';

// // Используем данную функцию в main.ts и в e2e тестах
// export const applyAppSettings = (app: INestApplication) => {
//     // Установка префикса
//     setAppPrefix(app);

//     // Конфигурация swagger документации
//     setSwagger(app);
// };

// const setAppPrefix = (app: INestApplication) => {
//     // Устанавливается для разворачивания front-end и back-end на одном домене
//     // https://site.com - front-end
//     // https://site.com/api - backend-end
//     app.setGlobalPrefix(APP_PREFIX);
// };

// const setSwagger = (app: INestApplication) => {
//     if (!configuration().environmentSettings.isProduction) {
//         const swaggerPath = APP_PREFIX + '/swagger-doc';

//         const config = new DocumentBuilder()
//             .setTitle('BLOGGER API')
//             .addBearerAuth()
//             .setVersion('1.0')
//             .build();

//         const document = SwaggerModule.createDocument(app, config);
//         SwaggerModule.setup(swaggerPath, app, document, {
//             customSiteTitle: 'Blogger Swagger',
//         });
//     }
// };