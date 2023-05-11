import { Injectable, Logger } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { PostDto } from './dto/post.dto';
import { InjectKnex, Knex } from 'nestjs-knex';
import { UserEntity } from '../user/entities/user.entity';
import { PostEntity } from './entities/post.entity';
import { UpdatePostInput } from './dto/update-post.input';

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
      .select({ createdBy: 'created_by' })
      .select({ updatedAt: 'updated_at' })
      .select({ updatedBy: 'updated_by' })
      .where('id', id)
      .andWhere('is_used', true)
      .first();

    if (!post) {
      return null;
    }

    return post;
  }

  /**
   * 게시글을 생성합니다.
   * @param input
   */
  async create(input: CreatePostInput): Promise<PostDto> {
    const { title, content, createdBy } = input;

    this.logger.debug(`input: ${JSON.stringify(input)}`);

    // 존재하는 유저인지 확인
    const [row] = await this.knex<UserEntity>('user').where('id', createdBy).count('*', { as: 'count' });
    if (row.count === 0) {
      throw new Error('id 에 해당하는 유저가 존재하지 않습니다!');
    }

    const [id] = await this.knex('post').insert({ title, content, created_by: createdBy });

    return this.get(id.toString()) as Promise<PostDto>;
  }

  /**
   * 게시글을 수정합니다.
   * @param input
   */
  async update(input: UpdatePostInput): Promise<PostDto> {
    const { id, title, content, updatedBy } = input;

    this.logger.debug(`id: ${id}, input: ${JSON.stringify(input)}`);

    // 존재하는 게시글인지 확인
    const [post] = await this.knex<PostEntity>('post')
      .where('id', id)
      .andWhere('is_used', true)
      .count('*', { as: 'count' });
    if (post.count === 0) {
      throw new Error('id 에 해당하는 게시글이 존재하지 않습니다!');
    }

    // 존재하는 유저인지 확인
    const [user] = await this.knex<UserEntity>('user')
      .where('id', updatedBy)
      .andWhere('is_used', true)
      .count('*', { as: 'count' });
    if (user.count === 0) {
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
