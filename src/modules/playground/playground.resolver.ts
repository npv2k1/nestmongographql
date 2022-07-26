import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PlaygroundService } from './playground.service';
import { Playground } from './entities/playground.entity';
import { CreatePlaygroundInput } from './dto/create-playground.input';
import { UpdatePlaygroundInput } from './dto/update-playground.input';

@Resolver(() => Playground)
export class PlaygroundResolver {
  constructor(private readonly playgroundService: PlaygroundService) {}

  @Mutation(() => Playground)
  createPlayground(@Args('createPlaygroundInput') createPlaygroundInput: CreatePlaygroundInput) {
    return this.playgroundService.create(createPlaygroundInput);
  }

  @Query(() => [Playground], { name: 'playground' })
  findAll() {
    return this.playgroundService.findAll();
  }

  @Query(() => Playground, { name: 'playground' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.playgroundService.findOne(id);
  }

  @Mutation(() => Playground)
  updatePlayground(@Args('updatePlaygroundInput') updatePlaygroundInput: UpdatePlaygroundInput) {
    return this.playgroundService.update(updatePlaygroundInput.id, updatePlaygroundInput);
  }

  @Mutation(() => Playground)
  removePlayground(@Args('id', { type: () => Int }) id: number) {
    return this.playgroundService.remove(id);
  }
}
