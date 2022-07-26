import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreatePlaygroundInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
