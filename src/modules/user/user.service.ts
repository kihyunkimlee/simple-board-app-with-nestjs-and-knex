import { Injectable, Logger } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { CreateUserInput } from './dto/create-user.input';
import { UserEntity } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { UpdateUserInput } from './dto/update-user.input';
import { UserSettingDto } from './dto/user-setting.dto';
import { UpdateUserSettingInput } from './dto/update-user-setting.input';

@Injectable()
export class UserService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(@InjectKnex() private readonly knex: Knex) {}

  /**
   * 유저를 생성합니다.
   * @param input
   */
  async create(input: CreateUserInput): Promise<UserDto> {
    this.logger.debug(`input: ${JSON.stringify(input)}`);

    const { email, password, nickname } = input;

    // 이메일 중복 체크
    const [row] = await this.knex<UserEntity>('user').where('email', email).count({ cnt: '*' });
    if (row.cnt! > 0) {
      throw new Error('중복된 이메일입니다!');
    }

    // 저장
    const [id] = await this.knex<UserEntity>('user').insert({
      email,
      password,
      nickname,
      setting: this.knex.raw(`JSON_OBJECT('receive_new_comment_alarm', true, 'receive_promotion_alarm', true)`),
    });

    return this.get(id.toString()) as Promise<UserDto>;
  }

  /**
   * id 로 유저 정보를 조회합니다.
   * @param id
   */
  async get(id: string): Promise<UserDto | null> {
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
   * @param id
   * @param input
   */
  async update(id: string, input: UpdateUserInput): Promise<UserDto> {
    const { nickname } = input;

    this.logger.debug(`id: ${id}, nickname: ${nickname}`);

    const [row] = await this.knex<UserEntity>('user').where('id', id).andWhere('is_used', true).count({ cnt: '*' });

    if (row.cnt! === 0) {
      throw new Error('id 에 해당하는 사용자가 없습니다!');
    }

    await this.knex('user').update<UserEntity>({ nickname }).where('id', id);

    return this.get(id) as Promise<UserDto>;
  }

  /**
   * 유저 정보를 삭제합니다.
   * @param id
   */
  async delete(id: string): Promise<UserDto> {
    this.logger.debug(`id: ${id}`);

    const user = await this.get(id);
    if (!user) {
      throw new Error('id 에 해당하는 사용자가 없습니다!');
    }

    await this.knex<UserEntity>('user').delete().where('id', id);

    return user;
  }

  /**
   * 사용자의 설정 정보를 조회합니다.
   * @param id
   */
  async getSetting(id: string): Promise<UserSettingDto> {
    this.logger.debug(`id: ${id}`);

    const userSetting = await this.knex<UserEntity>('user')
      .select({ receiveNewCommentAlarm: this.knex.raw(`JSON_EXTRACT(setting, '$.receive_new_comment_alarm')`) })
      .select({ receivePromotionAlarm: this.knex.raw(`JSON_EXTRACT(setting, '$.receive_promotion_alarm')`) })
      .where('id', id)
      .andWhere('is_used', true)
      .first();

    if (!userSetting) {
      throw new Error('id 에 해당하는 사용자가 없습니다!');
    }

    return userSetting as unknown as UserSettingDto;
  }

  /**
   * 사용자의 설정 정보를 수정합니다.
   * @param id
   * @param input
   */
  async updateSetting(id: string, input: UpdateUserSettingInput): Promise<UserSettingDto> {
    this.logger.debug(`id: ${id}, input: ${JSON.stringify(input)}`);

    const { receiveNewCommentAlarm, receivePromotionAlarm } = input;

    await this.knex<UserEntity>('user')
      .update(
        'setting',
        this.knex.raw(
          `JSON_SET(setting, '$.receive_new_comment_alarm', ${receiveNewCommentAlarm}, '$.receive_promotion_alarm', ${receivePromotionAlarm})`,
        ),
      )
      .where('id', id);

    return this.getSetting(id);
  }
}
