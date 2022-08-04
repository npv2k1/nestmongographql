import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { UserEntity } from 'src/common/decorators/user.decorator';

import { Roles } from 'src/common/decorators/roles.decorator';
import { User } from 'src/modules/users/schemas/user.schema';
import { GqlRolesGuard } from 'src/common/guards/gql/gql-role.guard';

@Resolver(() => User)
@UseGuards(GqlRolesGuard)
export class UsersResolver {
  @Query(() => User)
  @Roles('USER')
  async me(@UserEntity() user: User): Promise<User> {
    console.log('me user', user);
    return user;
  }
}
