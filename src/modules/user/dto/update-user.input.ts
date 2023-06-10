import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateUserInput {
  @MaxLength(60)
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
