import { OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/mongoose';
import { Todo, TodoDocument } from './schemas/todo.schema';

export class TodoRepository
  extends BaseRepository<TodoDocument>
  implements OnApplicationBootstrap
{
  constructor(@InjectModel(Todo.name) model: Model<TodoDocument>) {
    super(model);
  }

  async onApplicationBootstrap() {
    await this.createCollection();
  }
}
