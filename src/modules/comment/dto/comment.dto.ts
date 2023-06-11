export class CommentDto {
  id: string;

  postId: string;

  content: string;

  createdBy: string;

  createdAt: Date;

  updatedAt: Date | null;
}
