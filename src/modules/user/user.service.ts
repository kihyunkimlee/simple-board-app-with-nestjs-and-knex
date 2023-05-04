import { Injectable, Logger } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { CreateUserInput } from './dto/create-user.input';
import { UserEntity } from './entities/user.entity';
import { User } from './dto/user';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(@InjectKnex() private readonly knex: Knex) {}

  /**
   * 유저를 생성합니다.
   * @param input
   */
  async create(input: CreateUserInput): Promise<User> {
    this.logger.debug(`input: ${JSON.stringify(input)}`);

    const { email, password, nickname } = input;

    // 이메일 중복 체크
    const [row] = await this.knex<UserEntity>('user').where('email', email).count('*', { as: 'count' });
    if (row.count > 0) {
      throw new Error('중복된 이메일입니다!');
    }

    // 저장
    const [id] = await this.knex<UserEntity>('user').insert({ email, password, nickname });

    return this.get(id.toString()) as Promise<User>;
  }

  /**
   * id 로 유저 정보를 조회합니다.
   * @param id
   */
  async get(id: string): Promise<User | null> {
    this.logger.debug(`id: ${id}`);

    const user = await this.knex<UserEntity>('user')
      .select({ id: this.knex.raw('CAST(id AS CHAR)') })
      .select('email')
      .select('nickname')
      .select({ createdAt: 'created_at' })
      .select({ updatedAt: 'updated_at' })
      .where('is_used', true)
      .andWhere('id', id)
      .first();

    if (!user) {
      return null;
    }

    return user;
  }

  /**
   * 유저 정보를 수정합니다.
   * @param input
   */
  async update(input: UpdateUserInput): Promise<User> {
    const { id, nickname } = input;

    this.logger.debug(`id: ${id}, nickname: ${nickname}`);

    const [row] = await this.knex<UserEntity>('user')
      .where('id', id)
      .andWhere('is_used', true)
      .count('*', { as: 'count' });

    if (row.count === 0) {
      throw new Error('id 에 해당하는 사용자가 없습니다!');
    }

    await this.knex('user').update<UserEntity>({ nickname }).where('id', id);

    return this.get(id) as Promise<User>;
  }

  /**
   * 유저 정보를 삭제합니다.
   * @param id
   */
  async delete(id: string): Promise<User> {
    this.logger.debug(`id: ${id}`);

    const user = await this.get(id);
    if (!user) {
      throw new Error('id 에 해당하는 사용자가 없습니다!');
    }

    await this.knex<UserEntity>('user').delete().where('id', id);

    return user;
  }
}
