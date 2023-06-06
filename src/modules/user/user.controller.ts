import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './dto/user';
import { UpdateUserInput } from './dto/update-user.input';
import { PostsDto } from '../post/dto/posts.dto';
import { PostService } from '../post/post.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly postService: PostService) {}

  @Post()
  create(@Body('input') input: CreateUserInput): Promise<User> {
    return this.userService.create(input);
  }

  @Get()
  get(@Query('id') id: string): Promise<User | null> {
    return this.userService.get(id);
  }

  @Patch()
  update(@Body('input') input: UpdateUserInput): Promise<User> {
    return this.userService.update(input);
  }

  @Delete()
  delete(@Query('id') id: string): Promise<User> {
    return this.userService.delete(id);
  }

  @Get(':id/post')
  listByUser(
    @Param('id') userId: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<PostsDto> {
    return this.postService.listByUser(userId, offset, limit);
  }
}
