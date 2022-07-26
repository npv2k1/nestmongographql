import { RestRolesGuard } from './../../common/guards/rest/res-role.guard';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/schemas/user.schema';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@ApiBearerAuth()
@UseGuards(RestRolesGuard)
export class UsersController {
  @Get('me')
  @Roles('USER')
  async me(@ReqUser() user: User): Promise<User> {
    console.log('rest me user', user);
    return user;
  }
}
