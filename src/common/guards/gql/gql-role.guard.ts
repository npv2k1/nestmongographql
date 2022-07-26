import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/common/guards/gql/gql-jwt.guard';
import { UserRole } from 'src/modules/users/enums/role.enum';

@Injectable()
export class GqlRolesGuard extends GqlAuthGuard {
  constructor(private reflector: Reflector) {
    super();
  }
  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);
    const roles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) return true;
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const user = req.user;
    return roles.some((role) => user.role === role);
  }
}
