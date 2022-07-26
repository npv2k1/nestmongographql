import { TodoSchema } from './../../schemas/todo.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoResolver } from './todo.resolver';
import mongoose from 'mongoose';
import { Todo } from 'src/schemas/todo.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
  providers: [TodoResolver, TodoService],
})
export class TodoModule {}
