import { GqlAuthGuard } from 'src/common/guards/gql/gql-jwt.guard';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { Todo } from 'src/schemas/todo.schema';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { User } from 'src/schemas/user.schema';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Mutation(() => Todo)
  @UseGuards(GqlAuthGuard)
  createTodo(
    @UserEntity() user: User,
    @Args('createTodoInput') createTodoInput: CreateTodoInput
  ) {
    return this.todoService.create(createTodoInput, user);
  }

  @Query(() => [Todo], { name: 'todos' })
  findAll() {
    return this.todoService.findAll();
  }

  @Query(() => Todo, { name: 'todo' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.todoService.findOne(id);
  }

  @Mutation(() => Todo)
  updateTodo(@Args('updateTodoInput') updateTodoInput: UpdateTodoInput) {
    return this.todoService.update(updateTodoInput.id, updateTodoInput);
  }

  @Mutation(() => Todo)
  removeTodo(@Args('id', { type: () => String }) id: string) {
    return this.todoService.remove(id);
  }

  // @ResolveField('user')
  // user(@Parent() todo: Todo) {
  //   console.log(todo);
  //   return {
  //     id: '121',
  //   };
  // }
}
