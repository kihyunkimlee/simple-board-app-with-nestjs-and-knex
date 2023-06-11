import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
import { CommentsDto } from './dto/comments.dto';
import { UpdateCommentInput } from './dto/update-comment.input';

@Controller('post')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':postId/comment')
  list(
    @Param('postId') postId: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<CommentsDto> {
    return this.commentService.listByPost(postId, offset, limit);
  }

  @Post(':postId/comment')
  create(@Param('postId') postId: string, @Body('input') input: CreateCommentInput): Promise<CommentDto> {
    return this.commentService.create(postId, input);
  }

  @Patch(':postId/comment/:commentId')
  update(@Param('commentId') commentId: string, @Body('input') input: UpdateCommentInput): Promise<CommentDto> {
    return this.commentService.update(commentId, input);
  }

  @Delete(':postId/comment/:commentId')
  delete(@Param('commentId') commentId: string): Promise<CommentDto> {
    return this.commentService.delete(commentId);
  }
}
