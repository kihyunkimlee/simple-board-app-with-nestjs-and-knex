import { IsNotEmpty, IsNumberString, IsString, MaxLength } from 'class-validator';

export class UpdatePostInput {
  @MaxLength(255)
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumberString()
  @IsNotEmpty()
  updatedBy: string;
}
