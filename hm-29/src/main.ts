import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exeption-filters/exception.filter';
import { ErrorType, ErrorResponse } from './common/types/types';
import * as cookieParser from 'cookie-parser';
import config from './common/settings/configuration'
import { TelegramService } from './common/services/telegram-service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const telegramService = await app.resolve(TelegramService);
  app.enableCors();
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
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(cookieParser());
  await telegramService.setWebhook();
  await app.listen(config().apiSettings.PORT);
}
bootstrap();
