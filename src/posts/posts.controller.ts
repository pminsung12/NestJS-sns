import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PostsService } from './posts.service';

/**
 * author: string;
 * title: string;
 * content: string;
 * likeCount: number;
 * commentCount: number;
 * */

interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

const posts: PostModel[] = [
  {
    id: 1,
    author: 'John Doe',
    title: 'Hello World',
    content: 'Hello world from John Doe',
    likeCount: 10,
    commentCount: 2,
  },
  {
    id: 2,
    author: 'Sally Kim',
    title: 'Hello World',
    content: 'Hello world from Sally Kim',
    likeCount: 13,
    commentCount: 15,
  },
  {
    id: 3,
    author: 'Banana',
    title: 'Hello World',
    content: 'Hello world from Banana',
    likeCount: 92,
    commentCount: 34,
  },
];
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getPosts(): PostModel[] {
    return posts;
  }

  @Get(':id')
  getPost(@Param('id') id: string): PostModel {
    const post = posts.find((post) => post.id === +id);
    if (!post) {
      throw new NotFoundException('The post is not found');
    }
    return post;
  }
}
