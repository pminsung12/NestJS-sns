import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
@Injectable()
export class BasicTokenGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // true면 통과, false면 통과 못함
    const req = context.switchToHttp().getRequest();
    // {authorization: 'Basic awwfwefawfewwf'}
    const rawToken = req.headers.authorization;
    if (!rawToken) {
      throw new UnauthorizedException('토큰이 없습니다!');
    }

    const token = this.authService.extractTokenFromHeader(rawToken, false);

    const { email, password } = this.authService.decodeBasicToken(token);

    const user = await this.authService.authenticateWithEmailAndPassword({
      email,
      password,
    });

    req.user = user; //req 는 응답이 끝날 때까지 살아있음.

    return true;
  }
}
