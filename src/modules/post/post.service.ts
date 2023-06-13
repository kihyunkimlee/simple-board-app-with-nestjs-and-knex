import { Injectable, Logger } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { PostDto } from './dto/post.dto';
import { InjectKnex, Knex } from 'nestjs-knex';
import { UserEntity } from '../user/entities/user.entity';
import { PostEntity } from './entities/post.entity';
import { UpdatePostInput } from './dto/update-post.input';
import { PostsDto } from './dto/posts.dto';
import { CommentEntity } from '../comment/entities/comment.entity';
import { FavoritePostEntity } from '../user/entities/favorite-post.entity';

@Injectable()
export class PostService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(@InjectKnex() private readonly knex: Knex) {}

  /**
   * 게시글을 조회합니다.
   * @param id
   */
  async get(id: string): Promise<PostDto | null> {
    this.logger.debug(`id: ${id}`);

    const post = await this.knex<PostEntity>('post')
      .select({ id: this.knex.raw('CAST(id AS CHAR)') })
      .select('title')
      .select('content')
      .select({ createdAt: 'created_at' })
      .select({ createdBy: this.knex.raw('CAST(created_by AS CHAR)') })
      .select({ updatedAt: 'updated_at' })
      .select({ updatedBy: this.knex.raw('CAST(updated_by AS CHAR)') })
      .where('id', id)
      .andWhere('is_used', true)
      .first();

    if (!post) {
      return null;
    }

    return post;
  }

  /**
   * 게시글을 목록 조회 합니다.
   * @param offset
   * @param limit
   * @param title
   */
  async list(offset: number, limit: number, title?: string): Promise<PostsDto> {
    this.logger.debug(`offset: ${offset}, limit: ${limit}`);

    const qb = this.knex<PostEntity>('post').where('is_used', true);

    if (title) {
      qb.andWhereILike('title', `%${title}%`);
    }

    const [row] = await qb.clone().count({ cnt: '*' });

    const total = row.cnt as number;
    if (total === 0) {
      return {
        offset,
        limit,
        items: [],
        total,
      };
    }

    const postList = await qb
      .clone()
      .select({ id: this.knex.raw('CAST(id AS CHAR)') })
      .select('title')
      .select('content')
      .select({ createdAt: 'created_at' })
      .select({ createdBy: this.knex.raw('CAST(created_by AS CHAR)') })
      .select({ updatedAt: 'updated_at' })
      .select({ updatedBy: this.knex.raw('CAST(updated_by AS CHAR)') })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    return {
      offset,
      limit,
      items: postList,
      total,
    };
  }

  /**
   * 유저가 댓글 단 게시글을 목록 조회합니다.
   * @param userId
   * @param offset
   * @param limit
   */
  async listCommentedByUser(userId: string, offset: number, limit: number): Promise<PostsDto> {
    this.logger.debug(`userId: ${userId}, offset: ${offset}, limit: ${limit}`);

    const qb = this.knex<PostEntity>('post').whereIn(
      'id',
      this.knex<CommentEntity>('comment').select('post_id').where('created_by', userId),
    );

    const [row] = await qb.clone().count({ cnt: '*' });

    const total = row.cnt as number;
    if (total === 0) {
      return {
        offset,
        limit,
        items: [],
        total,
      };
    }

    const postList = await qb
      .clone()
      .select({ id: this.knex.raw('CAST(id AS CHAR)') })
      .select('title')
      .select('content')
      .select({ createdAt: 'created_at' })
      .select({ createdBy: this.knex.raw('CAST(created_by AS CHAR)') })
      .select({ updatedAt: 'updated_at' })
      .select({ updatedBy: this.knex.raw('CAST(updated_by AS CHAR)') })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    return {
      offset,
      limit,
      items: postList,
      total,
    };
  }

  /**
   * 유저가 즐겨찾기 목록에 추가한 게시글을 목록 조회합니다.
   * @param userId
   * @param offset
   * @param limit
   */
  async listFavoritePost(userId: string, offset: number, limit: number): Promise<PostsDto> {
    this.logger.debug(`userId: ${userId}, offset: ${offset}, limit: ${limit}`);

    const qb = this.knex<PostEntity>('post')
      .innerJoin<FavoritePostEntity>('favorite-post', function () {
        this.on('post.id', '=', 'favorite-post.post_id').andOn('favorite-post.user_id', '=', userId);
      })
      .where('post.is_used', true);

    const [row] = await qb.clone().count({ cnt: '*' });

    const total = row.cnt as number;
    if (total === 0) {
      return {
        offset,
        limit,
        items: [],
        total,
      };
    }

    const postList = await qb
      .clone()
      .select({ id: this.knex.raw('CAST(post.id AS CHAR)') })
      .select({ title: 'post.title' })
      .select(this.knex.ref('content').withSchema('post'))
      .select(this.knex.ref('created_at').withSchema('post').as('createdAt'))
      .select({ createdBy: this.knex.raw('CAST(post.created_by AS CHAR)') })
      .select(this.knex.ref('updated_at').withSchema('post').as('updatedAt'))
      .select({ updatedBy: this.knex.raw('CAST(post.updated_by AS CHAR)') })
      .orderBy('post.created_at', 'desc')
      .limit(limit)
      .offset(offset);

    return {
      offset,
      limit,
      items: postList,
      total,
    };
  }

  /**
   * 게시글을 생성합니다.
   * @param input
   */
  async create(input: CreatePostInput): Promise<PostDto> {
    const { title, content, createdBy } = input;

    this.logger.debug(`input: ${JSON.stringify(input)}`);

    // 존재하는 유저인지 확인
    const [row] = await this.knex<UserEntity>('user').where('id', createdBy).count({ cnt: '*' });
    if (row.cnt! === 0) {
      throw new Error('id 에 해당하는 유저가 존재하지 않습니다!');
    }

    const [id] = await this.knex('post').insert({ title, content, created_by: createdBy });

    return this.get(id.toString()) as Promise<PostDto>;
  }

  /**
   * 게시글을 수정합니다.
   * @param id
   * @param input
   */
  async update(id: string, input: UpdatePostInput): Promise<PostDto> {
    const { title, content, updatedBy } = input;

    this.logger.debug(`id: ${id}, input: ${JSON.stringify(input)}`);

    // 존재하는 게시글인지 확인
    const [post] = await this.knex<PostEntity>('post').where('id', id).andWhere('is_used', true).count({ cnt: '*' });
    if (post.cnt! === 0) {
      throw new Error('id 에 해당하는 게시글이 존재하지 않습니다!');
    }

    // 존재하는 유저인지 확인
    const [user] = await this.knex<UserEntity>('user')
      .where('id', updatedBy)
      .andWhere('is_used', true)
      .count({ cnt: '*' });
    if (user.cnt! === 0) {
      throw new Error('id 에 해당하는 유저가 존재하지 않습니다!');
    }

    await this.knex<PostEntity>('post')
      .update({
        title,
        content,
        updated_at: new Date(),
        updated_by: updatedBy,
      })
      .where('id', id);

    return this.get(id) as Promise<PostDto>;
  }

  /**
   * 게시글을 삭제합니다.
   * @param id
   */
  async delete(id: string): Promise<PostDto> {
    this.logger.debug(`id: ${id}`);

    // 존재하는 게시글인지 확인
    const post = await this.get(id);
    if (!post) {
      throw new Error('id 에 해당하는 게시글이 존재하지 않습니다!');
    }

    await this.knex<PostEntity>('post').delete().where('id', id);

    return post as PostDto;
  }
}
