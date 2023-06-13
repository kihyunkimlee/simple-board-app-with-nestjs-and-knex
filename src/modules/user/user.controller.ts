import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { UserDto } from './dto/user.dto';
import { UpdateUserInput } from './dto/update-user.input';
import { PostsDto } from '../post/dto/posts.dto';
import { PostService } from '../post/post.service';
import { UserSettingDto } from './dto/user-setting.dto';
import { UpdateUserSettingInput } from './dto/update-user-setting.input';
import { AddFavoritePostInput } from './dto/add-favorite-post.input';
import { RemoveFavoritePostInput } from './dto/remove-favorite-post.input';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly postService: PostService) {}

  /**
   * 유저 정보를 조회합니다.
   * @param id
   */
  @Get(':id')
  get(@Param('id') id: string): Promise<UserDto | null> {
    return this.userService.get(id);
  }

  /**
   * 유저 정보를 생성합니다.
   * @param input
   */
  @Post()
  create(@Body('input') input: CreateUserInput): Promise<UserDto> {
    return this.userService.create(input);
  }

  /**
   * 유저 정보를 수정합니다.
   * @param id
   * @param input
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body('input') input: UpdateUserInput): Promise<UserDto> {
    return this.userService.update(id, input);
  }

  /**
   * 유저 정보를 삭제합니다.
   * @param id
   */
  @Delete(':id')
  delete(@Param('id') id: string): Promise<UserDto> {
    return this.userService.delete(id);
  }

  /**
   * 유저가 댓글 단 게시글을 목록 조회합니다.
   * @param userId
   * @param offset
   * @param limit
   */
  @Get(':id/comment-post')
  listPostCommentedByUser(
    @Param('id') userId: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<PostsDto> {
    return this.postService.listCommentedByUser(userId, offset, limit);
  }

  /**
   * 유저 설정 정보를 조회합니다.
   * @param id
   */
  @Get(':id/setting')
  getSetting(@Param('id') id: string): Promise<UserSettingDto> {
    return this.userService.getSetting(id);
  }

  /**
   * 유저 설정 정보를 수정합니다.
   * @param id
   * @param input
   */
  @Patch(':id/setting')
  updateSetting(@Param('id') id: string, @Body('input') input: UpdateUserSettingInput): Promise<UserSettingDto> {
    return this.userService.updateSetting(id, input);
  }

  /**
   * 게시글을 즐겨찾기 목록에 추가합니다.
   * @param id
   * @param input
   */
  @Post(':id/favorite-post')
  addFavoritePost(@Param('id') id: string, @Body('input') input: AddFavoritePostInput): Promise<void> {
    return this.userService.addFavoritePost(id, input);
  }

  /**
   * 게시글을 즐겨찾기 목록에서 삭제합니다.
   * @param id
   * @param input
   */
  @Post(':id/favorite-post')
  removeFavoritePost(@Param('id') id: string, @Body('input') input: RemoveFavoritePostInput): Promise<void> {
    return this.userService.removeFavoritePost(id, input);
  }

  /**
   * 유저가 즐겨찾기 목록에 추가한 게시글을 목록 조회합니다.
   * @param userId
   * @param offset
   * @param limit
   */
  @Get(':id/favorite-post')
  listFavoritePost(
    @Param('id') userId: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<PostsDto> {
    return this.postService.listFavoritePost(userId, offset, limit);
  }
}
