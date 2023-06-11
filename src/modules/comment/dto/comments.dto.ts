import { CommentDto } from './comment.dto';

export class CommentsDto {
  offset: number;
  limit: number;
  items: CommentDto[];
  total: number;
}
