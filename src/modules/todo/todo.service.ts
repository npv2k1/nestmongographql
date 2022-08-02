import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Todo } from 'src/schemas/todo.schema';
import { User } from 'src/schemas/user.schema';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name)
    private readonly TodoModel: Model<Todo>
  ) {}

  create(createTodoInput: CreateTodoInput, user: User) {
    return this.TodoModel.create({ ...createTodoInput, user: user.id });
  }

  async findAll(userId: string) {
    const list = await this.TodoModel.find({ user: userId }).populate('user');
    console.log('list', list);
    return list;
  }

  findOne(id: string) {
    return this.TodoModel.findById(id);
  }

  update(id: string, updateTodoInput: UpdateTodoInput) {
    return this.TodoModel.findByIdAndUpdate(id, updateTodoInput);
  }

  remove(id: string) {
    return this.TodoModel.deleteOne({ id });
  }
}
