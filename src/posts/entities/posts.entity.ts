import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity';
import { BaseModel } from '../../common/entity/base.entity';
import { IsString } from 'class-validator';

@Entity()
export class PostsModel extends BaseModel {
  @ManyToOne(() => UsersModel, (user) => user.posts, { nullable: false })
  author: UsersModel;

  @Column()
  @IsString({
    message: '제목은 문자열로 입력해주세요.',
  })
  title: string;

  @Column()
  @IsString({
    message: '내용은 문자열로 입력해주세요.',
  })
  content: string;

  @Column()
  likeCount: number;

  @Column()
  commentCount: number;
}
