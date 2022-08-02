import { Field } from '@nestjs/graphql';
import { Prop } from '@nestjs/mongoose';

export class Post {
  @Prop()
  @Field()
  title: string;


}
