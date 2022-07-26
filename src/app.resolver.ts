import {
  Resolver,
  Query,
  Args,
  Subscription,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();
@ObjectType()
class Mess {
  @Field(() => String)
  message?: string;
}

@Resolver(() => Mess)
export class AppResolver {
  @Query(() => String)
  async helloWorld(): Promise<string> {
    console.log('have to publish', 'hello world');
    pubSub.publish('mess', { helloSub: { message: 'cjhsdnchj' } });
    return 'Hello World!';
  }
  @Query(() => String)
  hello(@Args('name') name: string): string {
    return `Hello ${name}!`;
  }

  @Subscription(() => Mess)
  helloSub() {
    console.log('have to subscribe');
    return pubSub.asyncIterator('mess');
  }
}
