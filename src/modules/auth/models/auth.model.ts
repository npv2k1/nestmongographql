import { ObjectType } from '@nestjs/graphql';
import { User } from 'src/modules/users/schemas/user.schema';
import { Token } from './token.model';

@ObjectType()
export class Auth extends Token {
  user: User;
}
