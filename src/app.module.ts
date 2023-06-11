import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { CustomConfigModule } from '@config/config.module';
import { DatabaseModule } from '@database/database.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';

@Module({
  imports: [CustomConfigModule, DatabaseModule, UserModule, PostModule, CommentModule],
})
export class AppModule {}
