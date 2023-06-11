import { Injectable, Logger } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { CreateCommentInput } from './dto/create-comment.input';
import { CommentDto } from './dto/comment.dto';
import { CommentsDto } from './dto/comments.dto';
import { UpdateCommentInput } from './dto/update-comment.input';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(@InjectKnex() private readonly knex: Knex) {}

  /**
   * 댓글을 조회합니다.
   * @param id
   */
  async get(id: string): Promise<CommentDto | null> {
    this.logger.debug(`id: ${id}`);

    const comment = await this.knex('comment')
      .select({ id: this.knex.raw('CAST(id AS CHAR)') })
      .select({ postId: this.knex.raw('CAST(post_id AS CHAR)') })
      .select('content')
      .select({ createdBy: this.knex.raw('CAST(created_by AS CHAR)') })
      .select({ createdAt: 'created_at' })
      .select({ updatedAt: 'updated_at' })
      .where('is_used', true)
      .first();

    if (!comment) {
      return null;
    }

    return comment;
  }

  /**
   * 게시글의 댓글을 목록 조회합니다.
   * @param postId
   * @param offset
   * @param limit
   */
  async listByPost(postId: string, offset: number, limit: number): Promise<CommentsDto> {
    this.logger.debug(`postId: ${postId}, offset: ${offset}, limit: ${limit}`);

    const [row] = await this.knex('comment').where('post_id', postId).andWhere('is_used', true).count({ cnt: '*' });

    const total = row.cnt as number;
    if (total === 0) {
      return {
        offset,
        limit,
        items: [],
        total,
      };
    }

    const commentList = await this.knex('comment')
      .select({ id: this.knex.raw('CAST(id AS CHAR)') })
      .select({ postId: this.knex.raw('CAST(post_id AS CHAR)') })
      .select('content')
      .select({ createdBy: this.knex.raw('CAST(created_by AS CHAR)') })
      .select({ createdAt: 'created_at' })
      .select({ updatedAt: 'updated_at' })
      .where('post_id', postId)
      .andWhere('is_used', true)
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    return {
      offset,
      limit,
      items: commentList,
      total,
    };
  }

  /**
   * 댓글을 생성합니다.
   */
  async create(postId: string, input: CreateCommentInput): Promise<CommentDto> {
    const { content, createdBy } = input;

    // postId 에 해당하는 게시글이 존재하는지 유효성 검사
    const [row] = await this.knex('post').where('id', postId).andWhere('is_used', true).count({ cnt: '*' });
    if (row.cnt === 0) {
      throw new Error('게시글이 존재하지 않습니다!');
    }

    const [id] = await this.knex('comment').insert({ post_id: postId, content, created_by: createdBy });

    return this.get(id.toString()) as Promise<CommentDto>;
  }

  /**
   * 댓글을 수정합니다.
   * @param id
   * @param input
   */
  async update(id: string, input: UpdateCommentInput): Promise<CommentDto> {
    const { content, updatedBy } = input;

    this.logger.debug(`id: ${id}, input: ${JSON.stringify(input)}`);

    const comment = await this.get(id);
    if (!comment) {
      throw new Error('id 에 해당하는 댓글이 존재하지 않습니다!');
    }
    if (comment.createdBy !== updatedBy) {
      throw new Error('작성자만 댓글을 수정할 수 있습니다!');
    }

    await this.knex('comment').update({ content, updated_at: new Date() }).where('id', id);

    return this.get(id) as Promise<CommentDto>;
  }

  /**
   * 댓글을 삭제(soft-delete)합니다.
   * @param id
   */
  async delete(id: string): Promise<CommentDto> {
    this.logger.debug(`id: ${id}`);

    const comment = await this.get(id);
    if (!comment) {
      throw new Error('id 에 해당하는 댓글이 존재하지 않습니다!');
    }

    await this.knex('comment').update({ is_used: false }).where('id', id);

    return comment;
  }
}
