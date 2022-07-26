import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserEntity } from 'src/common/decorators/user.decorator';
import { RolesGuard } from 'src/common/guards/role.guard';
import { User } from 'src/schemas/user.schema';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  @Get('me')
  @Roles('USER')
  async me(@UserEntity() user: User): Promise<User> {
    console.log('me user', user);
    return user;
  }
}
