import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { DatabaseModule } from '../database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExceptionFilter } from './filters';
import { HelpersModule } from './helpers/helpers.module';
import { AuthMiddleware } from './middlewares';
import { TodoModule } from './modules/todo/todo.module';
import { UserModule } from './modules/user/user.module';

const MODULES = [
  DatabaseModule,
  HelpersModule,
  UserModule,
  TodoModule
]

@Module({
  imports: [...MODULES],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: "/auth/login", method: RequestMethod.POST },
        { path: "/auth/register", method: RequestMethod.POST }
      )
      .forRoutes("*");
  }
}