import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto } from './dto/post.dto';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':id')
  get(@Param('id') id: string): Promise<PostDto | null> {
    return this.postService.get(id);
  }

  @Post()
  create(@Body('input') input: CreatePostInput): Promise<PostDto> {
    return this.postService.create(input);
  }

  @Put()
  update(@Body('input') input: UpdatePostInput): Promise<PostDto> {
    return this.postService.update(input);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<PostDto> {
    return this.postService.delete(id);
  }
}
