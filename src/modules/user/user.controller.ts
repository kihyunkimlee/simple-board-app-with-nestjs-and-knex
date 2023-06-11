import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { UserDto } from './dto/user.dto';
import { UpdateUserInput } from './dto/update-user.input';
import { PostsDto } from '../post/dto/posts.dto';
import { PostService } from '../post/post.service';
import { UserSettingDto } from './dto/user-setting.dto';
import { UpdateUserSettingInput } from './dto/update-user-setting.input';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly postService: PostService) {}

  @Post()
  create(@Body('input') input: CreateUserInput): Promise<UserDto> {
    return this.userService.create(input);
  }

  @Get(':id')
  get(@Param('id') id: string): Promise<UserDto | null> {
    return this.userService.get(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('input') input: UpdateUserInput): Promise<UserDto> {
    return this.userService.update(id, input);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<UserDto> {
    return this.userService.delete(id);
  }

  @Get(':id/comment-post')
  listPostCommentedByUser(
    @Param('id') userId: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<PostsDto> {
    return this.postService.listCommentedByUser(userId, offset, limit);
  }

  @Get(':id/setting')
  getSetting(@Param('id') id: string): Promise<UserSettingDto> {
    return this.userService.getSetting(id);
  }

  @Patch(':id/setting')
  updateSetting(@Param('id') id: string, @Body('input') input: UpdateUserSettingInput): Promise<UserSettingDto> {
    return this.userService.updateSetting(id, input);
  }
}
