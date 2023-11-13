import { PickType } from '@nestjs/mapped-types';
import { MessagesModel } from '../entity/messages.entity';
import { IsNumber } from 'class-validator';

export class CreateMessagesDto extends PickType(MessagesModel, ['message']) {
  @IsNumber()
  chatId: number;

  // 이렇게 숫자로 받으면 안됨, access token 적용 전
  @IsNumber()
  authorId: number;
}
