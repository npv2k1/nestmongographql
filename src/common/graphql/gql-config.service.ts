import { AuthService } from './../../modules/auth/auth.service';
import { GraphqlConfig } from '../configs/config.interface';
import { ConfigService } from '@nestjs/config';
import { ApolloDriverConfig } from '@nestjs/apollo';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { AuthenticationError } from 'apollo-server-express';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(
    private configService: ConfigService,

    private authService: AuthService
  ) {}
  createGqlOptions(): ApolloDriverConfig {
    const graphqlConfig = this.configService.get<GraphqlConfig>('graphql');
    return {
      // schema options
      autoSchemaFile: graphqlConfig.schemaDestination || './src/schema.graphql',
      sortSchema: graphqlConfig.sortSchema,
      buildSchemaOptions: {
        numberScalarMode: 'integer',
      },
      // subscription
      installSubscriptionHandlers: true,
      subscriptions: {
        // 'graphql-ws': true,
        'graphql-ws': {
          onConnect: (context: any) => {
            const { connectionParams, extra } = context;
            // if (!connectionParams?.Authorization) {
            //   throw new AuthenticationError('authToken must be provided');
            // }
            // console.log('have connect graphql-ws', connectionParams);

            extra.req = {
              headers: {
                'content-type': 'application/json',
                authorization: connectionParams?.Authorization,
              },
            };
          },
        },
        'subscriptions-transport-ws': {
          onConnect: async (connectionParams: any) => {
            if (!connectionParams?.headers?.Authorization) {
              throw new AuthenticationError('authToken must be provided');
            }
            const token =
              connectionParams?.headers?.Authorization.split(' ')[1];
            console.log('token', token);
            if (!token) {
              throw new AuthenticationError('authToken must be provided');
            }

            /* A function that validates the token and returns the user. */
            // const user = await this.authService.validateAccessToken(token);
            // console.log('user', user);
            // return { user };

            const headers = Object.keys(connectionParams?.headers).reduce(
              (dest, key) => {
                dest[key.toLowerCase()] = connectionParams?.headers[key];
                return dest;
              },
              {}
            );
            // return header for passport
            return {
              req: {
                headers: headers,
              },
            };
          },
        },
      },
      context: async ({ req, connection, extra }) => {
        // console.log('context', connection, extra);
        // subscriptions
        if (extra) {
          // console.log('extra >>>', extra.req);
          return {
            req: {
              ...extra.req,
            },
          };
        }
        // queries and mutations
        return { req };
      },
      debug: graphqlConfig.debug,
      playground: graphqlConfig.playgroundEnabled,
    };
  }
}
