import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectIDMock } from 'graphql-scalars';
import mongoose, { Document, ObjectId, SchemaTypes } from 'mongoose';
import { User } from './user.schema';

// Schema for mongodb and graphql

/* We're using the @ObjectType() decorator to tell NestJS that this class is a GraphQL object type.
We're using the @Field() decorator to tell NestJS that this property is a GraphQL field */
@Schema()
@ObjectType()
export class Todo {
  @Field(() => String)
  id: string;

  @Prop({ type: String })
  @Field(() => String)
  title: string;

  @Prop({ type: String })
  @Field(() => String)
  content?: string;

  @Prop({ type: Boolean, default: false })
  @Field(() => Boolean)
  done: boolean;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Field(() => User)
  user?: User;
}

export const TodoDocument = Todo && Document;

export const TodoSchema = SchemaFactory.createForClass(Todo);

// Duplicate the ID field.
TodoSchema.virtual('id').get(function () {
  return this._id;
});

// Ensure virtual fields are serialised.
TodoSchema.set('toJSON', {
  virtuals: true,
});
