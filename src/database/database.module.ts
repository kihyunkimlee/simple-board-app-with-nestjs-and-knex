import { Module } from '@nestjs/common';
import { KnexModule } from 'nestjs-knex';
import { MysqlOptionsFactory } from '@database/factories/mysql-options.factory';

@Module({
  imports: [
    KnexModule.forRootAsync({
      useClass: MysqlOptionsFactory,
    }),
  ],
})
export class DatabaseModule {}
