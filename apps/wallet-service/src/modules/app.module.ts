import { MiddlewareConsumer, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware } from '../core/shared/middlewares/auth.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import path from 'path';
import config from '../core/config';
import { DatabaseConfig } from '../core/config/database';
import { SnakeNamingStrategy } from '../core/database/snake-naming.strategy';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [...config],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const config = configService.get<DatabaseConfig>(
          'database'
        ) as TypeOrmModuleOptions;
        return {
          ...config,
          namingStrategy: new SnakeNamingStrategy(),
          entities: [path.resolve(__dirname, 'modules/**/*.entity{.ts,.js}')],
          migrations: [
            path.resolve(__dirname, 'core/database/**/*.entity{.ts,.js}'),
          ],
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { jwtSecret, jwtExpiry } = configService.get('security');

        return {
          secret: jwtSecret,
          signOptions: { expiresIn: jwtExpiry },
        };
      },
    }),
    WalletModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}

