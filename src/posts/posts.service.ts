import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  FindOptionsWhere,
  LessThan,
  MoreThan,
  QueryRunner,
  Repository,
} from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginatePostDto } from './dto/paginate-post.dto';
import { CommonService } from '../common/common.service';
import { ENV_HOST_KEY, ENV_PROTOCOL_KEY } from '../common/const/env-keys.const';
import { ConfigService } from '@nestjs/config';
import {
  POST_PUBLIC_IMAGE_PATH,
  TEMP_FOLDER_PATH,
} from '../common/const/path.const';
import { join, basename } from 'path';
import { promises } from 'fs';
import { CreatePostImageDto } from './images/dto/create-image.dto';
import { ImageModel } from '../common/entity/image.entity';
import { DEFAULT_POST_FIND_OPTIONS } from './const/default-post-find-options.const';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
    @InjectRepository(ImageModel)
    private readonly imageRepository: Repository<ImageModel>,
    private readonly commonService: CommonService,
    private readonly configService: ConfigService,
  ) {}
  async getAllPosts() {
    return this.postsRepository.find({ ...DEFAULT_POST_FIND_OPTIONS });
  }

  async generatePosts(userId: number) {
    for (let i = 0; i < 100; i++) {
      await this.createPost(userId, {
        title: `임의로 생성된 포스트 제목 ${i}`,
        content: `임의로 생성된 포스트 내용 ${i}`,
        images: [],
      });
    }
  }

  // 1) 오름차 순으로 정렬하는 pagination만 구현한다
  async paginatePosts(dto: PaginatePostDto) {
    return this.commonService.paginate(
      dto,
      this.postsRepository,
      { ...DEFAULT_POST_FIND_OPTIONS },
      'posts',
    );
  }

  // async pagePaginatePosts(dto: PaginatePostDto) {
  //   /**
  //    * data: Data[];
  //    * total: number,
  //    *
  //    * [1] [2] [3] [4] [5] [6] [7] [8] [9] [10]
  //    */
  //   const [posts, count] = await this.postsRepository.findAndCount({
  //     skip: dto.take * (dto.page - 1), // 0, 20, 40, 60, 80, 100, 120, 140, 160, 180
  //     take: dto.take,
  //     order: {
  //       createdAt: dto.order__createdAt,
  //     },
  //   });
  //
  //   return {
  //     data: posts,
  //     total: count,
  //   };
  // }
  // async cursorPaginationPosts(dto: PaginatePostDto) {
  //   const where: FindOptionsWhere<PostsModel> = {};
  //
  //   if (dto.where__id__less_than) {
  //     where.id = LessThan(dto.where__id__less_than);
  //   } else if (dto.where__id__more_than) {
  //     where.id = MoreThan(dto.where__id__more_than);
  //   }
  //
  //   const posts = await this.postsRepository.find({
  //     where,
  //     order: { createdAt: dto.order__createdAt },
  //     take: dto.take,
  //   });
  //
  //   const lastItem =
  //     posts.length > 0 && posts.length === dto.take
  //       ? posts[posts.length - 1]
  //       : null;
  //
  //   const protocol = this.configService.get(ENV_PROTOCOL_KEY);
  //   const host = this.configService.get(ENV_HOST_KEY);
  //
  //   const nextUrl = lastItem && new URL(`${protocol}://${host}/posts`);
  //
  //   if (nextUrl) {
  //     for (const key of Object.keys(dto)) {
  //       if (dto[key]) {
  //         if (key !== 'where__id_more_than' && key !== 'where__id_less_than') {
  //           nextUrl.searchParams.append(key, dto[key]);
  //         }
  //       }
  //     }
  //
  //     let key = null;
  //
  //     if (dto.order__createdAt === 'ASC') {
  //       key = 'where__id_more_than';
  //     } else {
  //       key = 'where__id_less_than';
  //     }
  //
  //     nextUrl.searchParams.append(key, lastItem.id.toString());
  //   }
  //
  //   return {
  //     data: posts,
  //     cursor: {
  //       after: lastItem?.id ?? null,
  //     },
  //     count: posts.length,
  //     next: nextUrl?.toString() ?? null,
  //   };
  // }

  async getPostById(id: number, qr?: QueryRunner) {
    const repository = this.getRepository(qr);
    const post = await repository.findOne({
      ...DEFAULT_POST_FIND_OPTIONS,
      where: { id },
    });
    if (!post) {
      throw new NotFoundException('The post is not found');
    }
    return post;
  }

  // 트랜잭션 유무에 따라 repository 가지고 오는 함수
  getRepository(qr?: QueryRunner) {
    return qr
      ? qr.manager.getRepository<PostsModel>(PostsModel)
      : this.postsRepository;
  }

  async createPost(authorId: number, postDto: CreatePostDto, qr?: QueryRunner) {
    const repository = this.getRepository(qr);

    const post = repository.create({
      author: {
        id: authorId,
      },
      ...postDto,
      images: [],
      likeCount: 0,
      commentCount: 0,
    });
    const newPost = await repository.save(post);
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
