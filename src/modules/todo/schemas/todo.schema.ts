import { User } from '@modules/users/schemas/user.schema';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId, SchemaTypes } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');
import { PageInfo } from '@common/schemas/pageinfo.schema';

@Schema()
@ObjectType()
export class Todo {
  @Field((type) => ID)
  id: string;

  @Prop({ type: SchemaTypes.String })
  @Field(() => String)
  title: string;

  @Prop({ type: SchemaTypes.String })
  @Field(() => String)
  content?: string;

  @Prop({ type: SchemaTypes.Boolean, default: false })
  @Field(() => Boolean)
  done: boolean;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  @Field(() => User)
  user?: User;
}

@ObjectType()
export class TodoPagination {
  @Field(() => [Todo])
  docs: Todo[];
  @Field(() => PageInfo)
  pageInfo: PageInfo;
}

export type TodoDocument = Todo & Document;

export const TodoSchema = SchemaFactory.createForClass(Todo);

TodoSchema.plugin(mongoosePaginate);
TodoSchema.plugin(mongooseAggregatePaginate);
// Duplicate the ID field.
TodoSchema.virtual('id').get(function () {
  return this._id;
});

// Ensure virtual fields are serialised.
TodoSchema.set('toJSON', {
  virtuals: true,
});
