import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { GqlAuthGuard } from 'src/modules/auth/gql-auth.guard';

import { User } from 'src/schemas/user.schema';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  @Query(() => User)
  async me(@UserEntity() user: User): Promise<User> {
    console.log('me user', user);
    return user;
  }
}
