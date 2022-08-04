import { Injectable, BadRequestException } from '@nestjs/common';
import { PasswordService } from 'src/modules/auth/password.service';
import { ChangePasswordInput } from './dto/change-password.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Model } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    private passwordService: PasswordService,
    @InjectModel(User.name)
    private readonly UserModel: Model<User>
  ) {}

  updateUser(userId: string, newUserData: UpdateUserInput) {
    return this.UserModel.updateOne({ _id: userId }, newUserData);
  }

  async changePassword(
    userId: string,
    userPassword: string,
    changePassword: ChangePasswordInput
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      userPassword
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword
    );
    return this.UserModel.findByIdAndUpdate(userId, {
      password: hashedPassword,
    });
  }
}
