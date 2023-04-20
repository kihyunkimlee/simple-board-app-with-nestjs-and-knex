import { KnexModuleOptions, KnexModuleOptionsFactory } from 'nestjs-knex';
import { CustomConfigService } from '@config/config.service';
import { Injectable, Logger } from '@nestjs/common';
import { AppConfigKey, AppConfigs } from '@config/custom-config-files/app.config';
import { MySQLConfigKey, MySQLConfigs } from '@config/custom-config-files/mysql.config';

@Injectable()
export class MysqlOptionsFactory implements KnexModuleOptionsFactory {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly customConfigService: CustomConfigService) {}

  createKnexModuleOptions(): KnexModuleOptions | Promise<KnexModuleOptions> {
    const appConfigs = this.customConfigService.get<AppConfigs>(AppConfigKey);
    if (!appConfigs) {
      throw new Error('app configuration file not loaded!');
    }

    const databaseConfigs = this.customConfigService.get<MySQLConfigs>(MySQLConfigKey);
    if (!databaseConfigs) {
      throw new Error('database configuration file not loaded!');
    }

    const { isProduction } = appConfigs;
    const { host, port, database, user, password } = databaseConfigs;

    return {
      config: {
        debug: !isProduction,
        client: 'mysql2',
        connection: {
          host,
          port,
          database,
          user,
          password,
        },
        pool: {
          min: 5,
          max: isProduction ? 100 : 50,
        },
        acquireConnectionTimeout: 10000,
      },
    };
  }
}
