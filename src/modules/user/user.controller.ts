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

  @Get(':id')
  get(@Param('id') id: string): Promise<User | null> {
    return this.userService.get(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('input') input: UpdateUserInput): Promise<User> {
    return this.userService.update(id, input);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<User> {
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
}
