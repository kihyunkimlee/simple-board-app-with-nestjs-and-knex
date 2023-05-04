import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateUserInput {
  @IsString()
  @IsNotEmpty()
  id: string;

  @MaxLength(60)
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
