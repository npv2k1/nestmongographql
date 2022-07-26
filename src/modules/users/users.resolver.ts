import { RolesGuard } from './../../common/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { GqlAuthGuard } from 'src/modules/auth/gql-auth.guard';

import { User } from 'src/schemas/user.schema';
import { Roles } from 'src/common/decorators/roles.decorator';

@Resolver(() => User)
@UseGuards(RolesGuard)
export class UsersResolver {
  @Query(() => User)
  @Roles('USER')
  async me(@UserEntity() user: User): Promise<User> {
    console.log('me user', user);
    return user;
  }
}
