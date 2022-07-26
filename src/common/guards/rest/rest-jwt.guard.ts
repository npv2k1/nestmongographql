import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class RestAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('context', context.getType());
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    console.log('user', user, err);
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
