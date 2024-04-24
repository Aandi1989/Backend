import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './common/settings/apply-app-setting';
import config from './common/settings/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  applyAppSettings(app)

  await app.listen(config().apiSettings.PORT);
}
bootstrap();
