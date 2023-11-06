import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsWhere, LessThan, MoreThan, Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { HOST, PROTOCOL } from '../common/const/env.const';

/**
 * author: string;
 * title: string;
 * content: string;
 * likeCount: number;
 * commentCount: number;
 * */

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {}
  async getAllPosts() {
    return this.postsRepository.find({ relations: ['author'] });
  }

  async generatePosts(userId: number) {
    for (let i = 0; i < 100; i++) {
      await this.createPost(userId, {
        title: `임의로 생성된 포스트 제목 ${i}`,
        content: `임의로 생성된 포스트 내용 ${i}`,
      });
    }
  }

  // 1) 오름차 순으로 정렬하는 pagination만 구현한다
  async paginationPosts(dto: PaginatePostDto) {
    if (dto.page) {
      return this.pagePaginatePosts(dto);
    } else {
      return this.cursorPaginationPosts(dto);
    }
  }

  async pagePaginatePosts(dto: PaginatePostDto) {
    /**
     * data: Data[];
     * total: number,
     *
     * [1] [2] [3] [4] [5] [6] [7] [8] [9] [10]
     */
    const [posts, count] = await this.postsRepository.findAndCount({
      skip: dto.take * (dto.page - 1), // 0, 20, 40, 60, 80, 100, 120, 140, 160, 180
      take: dto.take,
      order: {
        createdAt: dto.order__createdAt,
      },
    });

    return {
      data: posts,
      total: count,
    };
  }
  async cursorPaginationPosts(dto: PaginatePostDto) {
    const where: FindOptionsWhere<PostsModel> = {};

    if (dto.where__id_less_than) {
      where.id = LessThan(dto.where__id_less_than);
    } else if (dto.where__id_more_than) {
      where.id = MoreThan(dto.where__id_more_than);
    }

    const posts = await this.postsRepository.find({
      where,
      order: { createdAt: dto.order__createdAt },
      take: dto.take,
    });

    const lastItem =
      posts.length > 0 && posts.length === dto.take
        ? posts[posts.length - 1]
        : null;

    const nextUrl = lastItem && new URL(`${PROTOCOL}://${HOST}/posts`);

    if (nextUrl) {
      for (const key of Object.keys(dto)) {
        if (dto[key]) {
          if (key !== 'where__id_more_than' && key !== 'where__id_less_than') {
            nextUrl.searchParams.append(key, dto[key]);
          }
        }
      }

      let key = null;

      if (dto.order__createdAt === 'ASC') {
        key = 'where__id_more_than';
      } else {
        key = 'where__id_less_than';
      }

      nextUrl.searchParams.append(key, lastItem.id.toString());
    }

    return {
      data: posts,
      cursor: {
        after: lastItem?.id ?? null,
      },
      count: posts.length,
      next: nextUrl?.toString() ?? null,
    };
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) {
      throw new NotFoundException('The post is not found');
    }
    return post;
  }

  async createPost(authorId: number, postDto: CreatePostDto) {
    const post = this.postsRepository.create({
      author: {
        id: authorId,
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
    });
    const newPost = await this.postsRepository.save(post);
    return newPost;
  }

  async updatePost(postId: number, updatePostDto: UpdatePostDto) {
    const { title, content } = updatePostDto;
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('The post is not found');
    }

    if (title) {
      post.title = title;
    }

    if (content) {
      post.content = content;
    }

    const newPost = await this.postsRepository.save(post);
    return newPost;
  }

  async deletePost(postId: number) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('The post is not found');
    }
    await this.postsRepository.delete(postId);
    return postId;
  }
}
