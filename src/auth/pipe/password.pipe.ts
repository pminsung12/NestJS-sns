import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PasswordPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    /**
     * value는 실제로 입력받은 값
     *
     */
    if (value.toString().length > 8) {
      throw new BadRequestException('비밀번호는 8자리 이하로 입력해주세요!');
    }
    return value.toString();
  }
}

@Injectable()
export class MaxLengthPipe implements PipeTransform {
  constructor(
    private readonly length: number,
    private readonly subject: string,
  ) {}
  transform(value: any, metadata: ArgumentMetadata): any {
    if (value.toString().length > this.length) {
      throw new BadRequestException(
        `${this.subject}의 최대 길이는 ${this.length}입니다!`,
      );
    }
    return value.toString();
  }
}

@Injectable()
export class MinLengthPipe implements PipeTransform {
  constructor(
    private readonly length: number,
    private readonly subject: string,
  ) {}
  transform(value: any, metadata: ArgumentMetadata): any {
    if (value.toString().length < this.length) {
      throw new BadRequestException(
        `${this.subject}의 최소 길이는 ${this.length}입니다!`,
      );
    }
    return value.toString();
  }
}
