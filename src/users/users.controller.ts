import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  /**
   * serialization -> 직렬화 -> 현재 시스템에서 사용되는 데이터 구조를 다른 시스템에서 사용할 수 있는 포맷으로 변환 : class의 object에서 json으로 변환
   * deserialization -> 역직렬화 -> 다른 시스템에서 사용하는 데이터 구조를 현재 시스템에서 사용할 수 있는 포맷으로 변환:
   */
  getUsers() {
    return this.usersService.getAllUsers();
  }

  // @Post()
  // postUser(
  //   @Body('nickname') nickname: string,
  //   @Body('email') email: string,
  //   @Body('password') password: string,
  // ) {
  //   return this.usersService.createUser({ nickname, email, password });
  // }
}
