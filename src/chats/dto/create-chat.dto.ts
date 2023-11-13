import { IsNumber } from 'class-validator';

export class CreateChatDto {
  @IsNumber({}, { each: true })
  userIds: number[];

  // 방 이름 넣어도 됨.
}
