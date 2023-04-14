import { registerAs } from '@nestjs/config';
import { AppEnv } from '../config.constant';

export const AppConfigKey = 'app';

export interface AppConfigs {
  appName: string;
  env: string;
  port: number;
  isProduction: boolean;
}

export const AppConfig = registerAs<AppConfigs>(AppConfigKey, () => {
  return {
    appName: process.env.APP_NAME || 'simple-board-app',
    env: process.env.APP_ENV || 'local',
    port: parseInt(process.env.APP_PORT || '3000'),
    isProduction: process.env.APP_ENV === AppEnv.PROD,
  };
});
