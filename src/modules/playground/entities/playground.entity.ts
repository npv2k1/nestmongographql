import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Playground {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
