export class UserEntity {
  id: number;

  email: string;

  password: string;

  nickname: string;

  setting: {
    receive_new_comment_alarm: boolean;

    receive_promotion_alarm: boolean;
  };

  is_used: boolean;

  created_at: Date;

  updated_at: Date;
}
