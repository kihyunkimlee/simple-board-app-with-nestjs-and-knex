export class PostEntity {
  id: number;

  title: string;

  content: string;

  is_used: boolean;

  created_at: Date;

  created_by: string;

  updated_at: Date | null;

  updated_by: string | null;
}
