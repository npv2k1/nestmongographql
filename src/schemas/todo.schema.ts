import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectIDMock } from 'graphql-scalars';
import mongoose, { Document, ObjectId } from 'mongoose';
import { User } from './user.schema';

// Schema for mongodb and graphql

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