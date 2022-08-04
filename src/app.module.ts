import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import config from 'src/common/configs/config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersModule } from 'src/modules/users/users.module';
import { GqlConfigService } from './common/graphql/gql-config.service';
import { AuthService } from './modules/auth/auth.service';
import { TodoModule } from './modules/todo/todo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [AuthModule],
      useClass: GqlConfigService,
      driver: ApolloDriver,
      inject: [ConfigService, AuthService],
    }),
    AuthModule,
    UsersModule,
    TodoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
