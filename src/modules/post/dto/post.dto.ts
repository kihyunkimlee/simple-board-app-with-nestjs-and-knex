export class PostDto {
  id: string;

  title: string;

  content: string;

  createdAt: Date;

  createdBy: string;

  updatedAt: Date | null;

  updatedBy: string | null;
}
