import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PostsDto } from './dto/posts.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':id')
  get(@Param('id') id: string): Promise<PostDto | null> {
    return this.postService.get(id);
  }

  @Get()
  list(
    @Query('offset') offset: number,
    @Query('limit') limit: number,
    @Query('title') title?: string,
  ): Promise<PostsDto> {
    return this.postService.list(offset, limit, title);
  }

  @Post()
  create(@Body('input') input: CreatePostInput): Promise<PostDto> {
    return this.postService.create(input);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('input') input: UpdatePostInput): Promise<PostDto> {
    return this.postService.update(id, input);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<PostDto> {
    return this.postService.delete(id);
  }
}
