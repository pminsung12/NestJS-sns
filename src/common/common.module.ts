import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { TEMP_FOLDER_PATH } from './const/path.const';
import { v4 as uuid } from 'uuid';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MulterModule.register({
      limits: {
        //바이트 단위로 입력
        fileSize: 10000000, //10MB 넘으면 에러
      },
      fileFilter: (req, file, cb) => {
        /**
         * cb(에러, boolean)
         *
         * 첫번째 파라미터는 에러가 있을 경우 에러 정보를 넣어준다.
         * 두번쨰 파라미터는 파일을 받을지 말지 boolean을 넣어준다.
         */
        const ext = extname(file.originalname);

        if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
          return cb(
            new BadRequestException('jpg/jpeg/png 파일만 업로드 가능합니다.'),
            false, // 파일 저장 x
          );
        }

        return cb(null, true); // 파일 저장 o
      },
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, TEMP_FOLDER_PATH); // 여기다가 파일 업로드
        },
        filename: function (req, file, cb) {
          cb(null, `${uuid()}${extname(file.originalname)}`); // 이름 겹치지 않도록 uuid 사용
        },
      }),
    }),
  ],
  controllers: [CommonController],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
