import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

// http exception을 잡아서 처리하는 필터
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    // 로그 파일을 생성하거나
    // 에러 모니터링 시스템에 API 콜 하기

    response.status(status).json({
      statusCode: status,
      messagee: exception.message,
      timestamp: new Date().toLocaleString(),
      path: request.url,
    });
  }
}
