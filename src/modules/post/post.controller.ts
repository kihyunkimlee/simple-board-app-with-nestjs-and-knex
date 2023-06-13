import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PostsDto } from './dto/posts.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * 게시글을 조회합니다.
   * @param id
   */
  @Get(':id')
  get(@Param('id') id: string): Promise<PostDto | null> {
    return this.postService.get(id);
  }

  /**
   * 게시글을 목록 조회합니다.
   * @param offset
   * @param limit
   * @param title
   */
  @Get()
  list(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('title') title?: string,
  ): Promise<PostsDto> {
    return this.postService.list(offset, limit, title);
  }

  /**
   * 게시글을 생성합니다.
   * @param input
   */
  @Post()
  create(@Body('input') input: CreatePostInput): Promise<PostDto> {
    return this.postService.create(input);
  }

  /**
   * 게시글을 수정합니다.
   * @param id
   * @param input
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body('input') input: UpdatePostInput): Promise<PostDto> {
    return this.postService.update(id, input);
  }

  /**
   * 게시글을 삭제합니다.
   * @param id
   */
  @Delete(':id')
  delete(@Param('id') id: string): Promise<PostDto> {
    return this.postService.delete(id);
  }
}
