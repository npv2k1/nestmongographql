import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Schema for mongodb and graphql

@Schema()
@ObjectType()
export class User {
  // @Field(() => String)
  // id: string;

  @Prop({ type: String, trim: true, index: true, required: true, unique: true })
  @Field(() => String)
  email: string;

  @Prop()
  @Field(() => String)
  firstname?: string;

  @Prop()
  @Field(() => String)
  lastname?: string;

  @Prop()
  @HideField()
  password: string;

  @Prop({ type: String, enum: ['ADMIN', 'USER'], default: 'USER' })
  @Field(() => String)
  role: string;
}

export const UserDocument = User && Document;
export const UserSchema = SchemaFactory.createForClass(User);
