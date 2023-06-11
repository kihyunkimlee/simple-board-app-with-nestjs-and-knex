export class CommentEntity {
  id: number;

  post_id: number;

  content: string;

  is_used: boolean;

  created_by: number;

  created_at: Date;

  updated_at: Date | null;
}
