import { Injectable, NotFoundException } from '@nestjs/common';

/**
 * author: string;
 * title: string;
 * content: string;
 * likeCount: number;
 * commentCount: number;
 * */

export interface PostModel {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

let posts: PostModel[] = [
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

@Injectable()
export class PostsService {
  getAllPosts(): PostModel[] {
    return posts;
  }

  getPostById(id: number) {
    const post = posts.find((post) => post.id === id);
    if (!post) {
      throw new NotFoundException('The post is not found');
    }
    return post;
  }

  createPost(author: string, title: string, content: string): PostModel {
    const newPost = {
      id: posts.length + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };
    posts = [...posts, newPost];
    return newPost;
  }

  updatePost(
    postId: number,
    author: string,
    title: string,
    content: string,
  ): PostModel {
    const post = posts.find((post) => post.id === postId);
    if (!post) {
      throw new NotFoundException('The post is not found');
    }

    if (author) {
      post.author = author;
    }

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }

    posts = posts.map((prevPost) => (prevPost.id === postId ? post : prevPost));
    return post;
  }

  deletePost(postId: number) {
    const post = posts.find((post) => post.id === postId);
    if (!post) {
      throw new NotFoundException('The post is not found');
    }
    posts = posts.filter((post) => post.id !== postId);
    return postId;
  }
}
