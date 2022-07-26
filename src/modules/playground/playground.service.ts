import { Injectable } from '@nestjs/common';
import { CreatePlaygroundInput } from './dto/create-playground.input';
import { UpdatePlaygroundInput } from './dto/update-playground.input';

@Injectable()
export class PlaygroundService {
  create(createPlaygroundInput: CreatePlaygroundInput) {
    return 'This action adds a new playground';
  }

  findAll() {
    return `This action returns all playground`;
  }

  findOne(id: number) {
    return `This action returns a #${id} playground`;
  }

  update(id: number, updatePlaygroundInput: UpdatePlaygroundInput) {
    return `This action updates a #${id} playground`;
  }

  remove(id: number) {
    return `This action removes a #${id} playground`;
  }
}
