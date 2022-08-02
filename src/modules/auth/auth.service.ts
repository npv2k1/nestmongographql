import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SecurityConfig } from 'src/common/configs/config.interface';
import { User } from 'src/schemas/user.schema';
import { SignupInput } from './dto/signup.input';
import { Token } from './models/token.model';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    @InjectModel(User.name)
    private readonly UserModel: Model<User>
  ) {}
  getJwtPayLoad(authToken: string): any {
    return this.jwtService.decode(authToken);
  }

  async createUser(payload: SignupInput): Promise<Token> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );
    console.log('signup input', payload);

    try {
      const user = await this.UserModel.create({
        ...payload,
        password: hashedPassword,
        role: 'USER',
      });

      console.log('user', user);

      return this.generateTokens({
        userId: user.id,
      });
    } catch (e) {
      console.log('error', e);
      throw new ConflictException(`Email ${payload.email} already used.`);
    }
  }

  async login(email: string, password: string): Promise<Token> {
    const user = await this.UserModel.findOne({ email });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      user.password
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    const token = this.generateTokens({
      userId: user.id,
    });
    console.log('user sss', user, user.id);
    return {
      ...token,
    };
  }

  async validateUser(userId: string): Promise<User> {
    console.log('validate user', userId);
    return this.UserModel.findOne({ _id: userId });
  }

  async validateAccessToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });

      return this.UserModel.findById(userId);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.UserModel.findById(id);
  }

  generateTokens(payload: { userId: string }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: string }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
