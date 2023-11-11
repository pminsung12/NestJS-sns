import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    /**
     * 요청이 들어올 때 REQ 요청이 들어온 타임스탬프를 찍느낟.
     * [REQ] {요청 path} {요청 시간}
     *
     * 요청이 끝날때 (응답이 나갈 떄) 다시 타임스탬프를 찍는다.
     * [RES] {요청 path} {응답 시간}
     */
    const now = new Date();

    const req = context.switchToHttp().getRequest();

    // /posts
    // /common/images
    const path = req.originalUrl;

    console.log(`[REQ] ${path} ${now.toLocaleString('kr')}`);

    // return next.handle()을 실해앟는 순간
    // 라우트의 로직이 전부 실행되고 응답이 반환된다.
    // observable로 반환된다. tap을 통해 응답을 확인할 수 있고, map을 통해 응답을 변경할 수 있다.
    // return next.handle().pipe(
    //   tap((observable) => {
    //     console.log(observable);
    //   }),
    //   map((observable) => {
    //     return {
    //       message: '응답이 변경 됐습니다.',
    //       response: observable,
    //     };
    //   }),
    //   tap((observable) => {
    //     console.log(observable);
    //   }),
    // );

    return next.handle().pipe(
      tap((observable) => {
        console.log(
          `[RES] ${path} ${new Date().toLocaleString('kr')} ${
            new Date().getMilliseconds() - now.getMilliseconds()
          }ms`,
        );
      }),
    );
  }
}
