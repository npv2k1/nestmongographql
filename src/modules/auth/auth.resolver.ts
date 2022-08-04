import { GqlAuthGuard } from 'src/common/guards/gql/gql-jwt.guard';
import { GqlRolesGuard } from 'src/common/guards/gql/gql-role.guard';
import {
  Resolver,
  Mutation,
  Args,
  Parent,
  ResolveField,
  Subscription,
} from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './models/auth.model';
import { Token } from './models/token.model';
import { LoginInput } from './dto/login.input';
import { SignupInput } from './dto/signup.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { pubSub } from 'src/common/graphql/pubsub.service';
import { User } from 'src/modules/users/schemas/user.schema';
import { UserEntity } from 'src/common/decorators/user.decorator';
// import { PubSub } from 'graphql-subscriptions';
// const pubSub = new PubSub();
@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly auth: AuthService) {}

  @Mutation(() => Auth)
  async signup(@Args('data') data: SignupInput) {
    data.email = data.email.toLowerCase();
    const { accessToken, refreshToken } = await this.auth.createUser(data);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => Auth)
  async login(@Args('data') { email, password }: LoginInput) {
    const dt = await this.auth.login(email.toLowerCase(), password);
    pubSub.publish('loginU', { UserLogin: dt }); // Tên biến payload trùng với tên hàm subscribtion {tenham: payload}
    return await this.auth.login(email.toLowerCase(), password);
  }

  @Mutation(() => Token)
  async refreshToken(@Args() { token }: RefreshTokenInput) {
    return this.auth.refreshToken(token);
  }

  /* A resolver that is used to resolve the user field in the Auth model. */
  @ResolveField('user')
  async user(@Parent() auth: Auth) {
    return await this.auth.getUserFromToken(auth.accessToken);
  }

  // @Roles('ADMIN')
  @Subscription(() => Auth)
  @UseGuards(GqlAuthGuard)
  UserLogin(@UserEntity() user: User) {
    console.log('have to subscribe', user);
    return pubSub.asyncIterator('loginU');
  }
}
