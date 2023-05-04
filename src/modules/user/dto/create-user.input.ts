import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateUserInput {
  @MaxLength(256)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MaxLength(256)
  @IsString()
  @IsNotEmpty()
  password: string;

  @MaxLength(60)
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
