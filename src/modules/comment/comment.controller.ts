import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateCommentInput } from './dto/create-comment.input';
import { CommentService } from './comment.service';
import { CommentDto } from './dto/comment.dto';
import { CommentsDto } from './dto/comments.dto';
import { UpdateCommentInput } from './dto/update-comment.input';

@Controller('post')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * 게시글의 댓글을 목록 조회합니다.
   * @param postId
   * @param offset
   * @param limit
   */
  @Get(':postId/comment')
  list(
    @Param('postId') postId: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ): Promise<CommentsDto> {
    return this.commentService.listByPost(postId, offset, limit);
  }

  /**
   * 댓글을 생성합니다.
   * @param postId
   * @param input
   */
  @Post(':postId/comment')
  create(@Param('postId') postId: string, @Body('input') input: CreateCommentInput): Promise<CommentDto> {
    return this.commentService.create(postId, input);
  }

  /**
   * 댓글을 수정합니다.
   * @param commentId
   * @param input
   */
  @Patch(':postId/comment/:commentId')
  update(@Param('commentId') commentId: string, @Body('input') input: UpdateCommentInput): Promise<CommentDto> {
    return this.commentService.update(commentId, input);
  }

  /**
   * 댓글을 삭제합니다.
   * @param commentId
   */
  @Delete(':postId/comment/:commentId')
  delete(@Param('commentId') commentId: string): Promise<CommentDto> {
    return this.commentService.delete(commentId);
  }
}
