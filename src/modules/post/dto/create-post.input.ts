import { IsNotEmpty, IsNumberString, IsString, MaxLength } from 'class-validator';

export class CreatePostInput {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumberString()
  @IsNotEmpty()
  createdBy: string;
}
