import { Column, Entity, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { RolesEnum } from '../const/roles.const';
import { PostsModel } from '../../posts/entities/posts.entity';
import { BaseModel } from '../../common/entity/base.entity';
import { IsEmail, IsString, Length } from 'class-validator';
import { lengthValidationMessage } from '../../common/validation-message/length-validation.message';
import { stringValidationMessage } from '../../common/validation-message/string-validation.message';
import { emailValidationMessage } from '../../common/validation-message/email-validation.message';
import { Exclude } from 'class-transformer';
import { ChatsModel } from '../../chats/entity/chats.entity';
import { MessagesModel } from '../../chats/messages/entity/messages.entity';
@Entity()
export class UsersModel extends BaseModel {
  @Column({ unique: true, length: 20 })
  @IsString({ message: stringValidationMessage })
  @Length(1, 20, {
    message: lengthValidationMessage,
  })
  nickname: string;

  @Column({ unique: true })
  @IsString({ message: stringValidationMessage })
  @IsEmail({}, { message: emailValidationMessage })
  email: string;

  @Column()
  @IsString({ message: stringValidationMessage })
  @Length(3, 8, {
    message: lengthValidationMessage,
  })
  @Exclude({
    toPlainOnly: true, // 응답이 나가는 상황에서만 제외된다. (요청 받을 땐 제외되지 않음)
  })
  password: string;

  @Column({
    enum: Object.values(RolesEnum),
    default: RolesEnum.USER,
  })
  role: RolesEnum;

  @OneToMany(() => PostsModel, (post) => post.author)
  posts: PostsModel[];

  // JoinTable은 ManyToMany에서 둘 중 하나의 테이블에만 적용하면 되고,
  // 사용하는 이유는 두 테이블을 연결해주는 테이블을 만들어주기 위함이다.
  @ManyToMany(() => ChatsModel, (chat) => chat.users)
  @JoinTable()
  chats: ChatsModel[];

  @OneToMany(() => MessagesModel, (message) => message.author)
  messages: MessagesModel;
}
