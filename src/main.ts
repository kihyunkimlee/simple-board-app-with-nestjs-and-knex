import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  AppConfigKey,
  AppConfigs,
} from './config/custom-config-files/app.config';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(logger);

  const configService = app.get(ConfigService);

  const appConfigs = configService.get<AppConfigs>(AppConfigKey);
  if (!appConfigs) {
    throw new Error('App configuration file not loaded!');
  }

  const { port } = appConfigs;

  await app.listen(port, () => {
    logger.log(`Server is listening on :${port} port`);
  });
}

bootstrap();
