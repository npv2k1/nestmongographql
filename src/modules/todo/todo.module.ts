import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo } from 'src/modules/todo/schemas/todo.schema';
import { TodoSchema } from './schemas/todo.schema';
import { TodoRepository } from './todo.repository';
import { TodoResolver } from './todo.resolver';
import { TodoService } from './todo.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]),
  ],
  providers: [TodoResolver, TodoService, TodoRepository],
})
export class TodoModule {}
