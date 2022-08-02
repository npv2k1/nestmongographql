import { GqlAuthGuard } from 'src/common/guards/gql/gql-jwt.guard';
import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
  Subscription,
} from '@nestjs/graphql';
import { TodoService } from './todo.service';
import { CreateTodoInput } from './dto/create-todo.input';
import { UpdateTodoInput } from './dto/update-todo.input';
import { Todo } from 'src/schemas/todo.schema';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { User } from 'src/schemas/user.schema';
import { pubSub } from 'src/common/graphql/pubsub.service';

@Resolver(() => Todo)
export class TodoResolver {
  constructor(private readonly todoService: TodoService) {}

  @Mutation(() => Todo)
  @UseGuards(GqlAuthGuard)
  async createTodo(
    @UserEntity() user: User,
    @Args('createTodoInput') createTodoInput: CreateTodoInput
  ) {
    const res = await this.todoService.create(createTodoInput, user);
    console.log('add todo', res);
    pubSub.publish('todo', { addTodo: res });
    return res;
  }

  @Query(() => [Todo], { name: 'todos' })
  @UseGuards(GqlAuthGuard)
  findAll(@UserEntity() user: User) {
    return this.todoService.findAll(user.id);
  }

  @Query(() => Todo, { name: 'todo' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.todoService.findOne(id);
  }

  @Mutation(() => Todo)
  updateTodo(@Args('updateTodoInput') updateTodoInput: UpdateTodoInput) {
    const res = this.todoService.update(updateTodoInput.id, updateTodoInput);
    pubSub.publish('todo', { addTodo: res });
    return res;
  }

  @Mutation(() => Todo)
  removeTodo(@Args('id', { type: () => String }) id: string) {
    return this.todoService.remove(id);
  }

  @Subscription(() => Todo)
  @UseGuards(GqlAuthGuard)
  addTodo(@UserEntity() user: User) {
    console.log('have to subscribe', user);
    return pubSub.asyncIterator('todo');
  }
  // @ResolveField('user')
  // user(@Parent() todo: Todo) {
  //   console.log(todo);
  //   return {
  //     id: '121',
  //   };
  // }
}
