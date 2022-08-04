import { TodoDocument } from './schemas/todo.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PipelineStage } from 'mongoose';
import { Todo } from 'src/modules/todo/schemas/todo.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { TodoRepository } from './todo.repository';
import mongoose from 'mongoose';
@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name)
    private readonly TodoModel: PaginateModel<TodoDocument>,
    private readonly todoRepository: TodoRepository
  ) {}

  create(createTodoInput: CreateTodoInput, user: User) {
    return this.TodoModel.create({ ...createTodoInput, user: user.id });
  }

  async findAll(userId: string) {
    const list = await this.TodoModel.find({ user: userId }).populate('user');
    const options = {
      page: 1,
      limit: 5,
    };

    const pipeLine: PipelineStage[] = [
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: {
          path: '$user',
        },
      },
      {
        $project: {
          id: '$_id',
          title: '$title',
          user: {
            id: '$user._id',
            email: '$user.email',
            role: '$user.role',
          },
        },
      },
    ];

    const tmp = await this.todoRepository.aggregatePaginate(pipeLine, options);
    const { docs, ...pageInfo } = tmp;
    return {
      docs,
      pageInfo,
    };
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
