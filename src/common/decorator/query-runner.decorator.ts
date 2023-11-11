import {
  createParamDecorator,
  InternalServerErrorException,
} from '@nestjs/common';

export const QueryRunner = createParamDecorator((data, context) => {
  const req = context.switchToHttp().getRequest();

  if (!req.queryRunner) {
    throw new InternalServerErrorException(
      'QueryRunner 데코레이터는 TransactionInterceptor와 함께 사용해야합니다. Request에 QueryRunner 정보가 없습니다.',
    );
  }

  return req.queryRunner;
});
