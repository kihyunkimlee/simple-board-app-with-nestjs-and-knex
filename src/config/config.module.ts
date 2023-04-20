import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppEnv } from './config.constant';
import { AppConfig } from './custom-config-files/app.config';
import { MySQLConfig } from './custom-config-files/mysql.config';
import { CustomConfigService } from '@config/config.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: false,
      ignoreEnvFile: process.env.APP_ENV === AppEnv.PROD,
      envFilePath: `.env.${process.env.APP_ENV || AppEnv.LOCAL}`,
      load: [AppConfig, MySQLConfig],
    }),
  ],
  providers: [CustomConfigService],
  exports: [CustomConfigService],
})
export class CustomConfigModule {}
