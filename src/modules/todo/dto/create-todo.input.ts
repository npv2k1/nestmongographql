import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTodoInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content?: string;

  @Field(() => Boolean)
  done: boolean;
}
