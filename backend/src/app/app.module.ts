import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { DatabaseModule } from '../database/database.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExceptionFilter } from './filters';
import { UserModule } from './modules/user/user.module';

const MODULES = [
  DatabaseModule,
  UserModule
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
export class AppModule { }
