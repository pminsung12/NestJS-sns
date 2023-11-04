import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersModel)
    private readonly usersRepository: Repository<UsersModel>,
  ) {}

  async getAllUsers() {
    return this.usersRepository.find({ relations: ['posts'] });
  }

  async createUser(user: Pick<UsersModel, 'email' | 'nickname' | 'password'>) {
    const nicknameExists = await this.usersRepository.exist({
      where: { nickname: user.nickname },
    });

    if (nicknameExists) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }

    const emailExists = await this.usersRepository.exist({
      where: { email: user.email },
    });

    if (emailExists) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    const userObj = this.usersRepository.create({
      nickname: user.nickname,
      email: user.email,
      password: user.password,
    });
    const newUser = await this.usersRepository.save(userObj);
    return newUser;
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
    });
  }
}
