import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { CustomConfigModule } from '@config/config.module';
import { DatabaseModule } from '@database/database.module';

@Module({
  imports: [CustomConfigModule, DatabaseModule, UserModule],
})
export class AppModule {}
