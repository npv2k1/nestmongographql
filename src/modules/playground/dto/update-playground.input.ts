import { CreatePlaygroundInput } from './create-playground.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePlaygroundInput extends PartialType(CreatePlaygroundInput) {
  @Field(() => Int)
  id: number;
}
