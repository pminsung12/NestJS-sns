import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * author: string;
 * title: string;
 * content: string;
 * likeCount: number;
 * commentCount: number;
 * */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getPost(): Post {
    return {
      author: 'newjeans_official',
      title: '뉴진스 민지',
      con,
    };
  }
}
