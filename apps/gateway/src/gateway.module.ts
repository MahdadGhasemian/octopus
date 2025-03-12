import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { RemoteGraphQLDataSource } from '@apollo/gateway';
import { IntrospectAndCompose } from '@apollo/gateway';
import { LoggerModule } from '@app/common';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        HTTP_PORT_GATEWAY: Joi.number().required(),
        GRAPHQL_SERVICE_URL_AUTH: Joi.string().required(),
        GRAPHQL_SERVICE_URL_STORE: Joi.string().required(),
        GRAPHQL_SERVICE_URL_STORAGE: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: async (configService: ConfigService) => ({
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [
              {
                name: 'auth',
                url: configService.get<string>('GRAPHQL_SERVICE_URL_AUTH'),
              },
              {
                name: 'store',
                url: configService.get<string>('GRAPHQL_SERVICE_URL_STORE'),
              },
              {
                name: 'storage',
                url: configService.get<string>('GRAPHQL_SERVICE_URL_STORAGE'),
              },
            ],
          }),
          buildService({ url }) {
            return new RemoteGraphQLDataSource({
              url,
              willSendRequest({ request, context }) {
                // Forward Cookies
                if (context?.req?.headers?.cookie) {
                  request.http.headers.set(
                    'cookie',
                    context.req.headers.cookie,
                  );
                }

                // Forward Authentication Header
                if (context?.req?.headers?.authentication) {
                  request.http.headers.set(
                    'authentication',
                    context.req.headers.authentication,
                  );
                }
              },
              async didReceiveResponse({ response, context }) {
                // Forward Cookies from Subgraph back to Gateway Client
                const cookies = response.http?.headers?.get('set-cookie');
                if (cookies) {
                  // Check if context.req.res exists and log the response
                  if (context?.req?.res) {
                    // Ensure that the cookies are set correctly in the Gateway response headers
                    context.req.res.setHeader('Set-Cookie', cookies);
                  }
                }

                // Return the response as required by the type signature
                return response;
              },
            });
          },
        },
        context: ({ req, res }) => ({ req, res }),
        cors: {
          origin: true,
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
          credentials: true,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class GatewayModule {}
