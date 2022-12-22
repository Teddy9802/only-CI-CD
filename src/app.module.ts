import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ProductModule } from './APIS/product/product.module';
import { userModule } from './APIS/user/user.module';
import { PaymentModule } from './APIS/payment/payments.module';
import { AuthModule } from './APIS/auth/auth.module';
import { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { JwtAccessStrategy } from './COMMONS/auth/jwt-access.strategy';
import { JwtRefreshStrategy } from './COMMONS/auth/jwt-refresh.strategy';
import { AppController } from './app.controller';
// import { FilesModule } from './APIS/files/files.modules';

@Module({
  imports: [
    ProductModule,
    userModule,
    PaymentModule,
    AuthModule,
    // FilesModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/COMMONS/graphql/schema.gql',
      context: ({ req, res }) => {
        return { req, res };
      },
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as 'mysql',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DATABASE,
      entities: [__dirname + '/APIS/**/*.entity.*'],
      synchronize: true,
      logging: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: 'redis://10.121.129.3:6379',
      isGlobal: true,
    }),
  ],
  providers: [JwtAccessStrategy, JwtRefreshStrategy],
  controllers: [AppController],
})
export class AppModule {}
