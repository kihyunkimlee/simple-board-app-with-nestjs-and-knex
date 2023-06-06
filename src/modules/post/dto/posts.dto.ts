import { PostDto } from './post.dto';

export class PostsDto {
  offset: number;

  limit: number;

  total: number;

  items: PostDto[];
}
