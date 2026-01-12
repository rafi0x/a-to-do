import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoController } from './controllers/todo.controller';
import { Todo } from './entities/todo.entity';
import { TodoRepository } from './repositories/todo.repository';
import { TodoService } from './services/todo.service';

const entities = [Todo];
const controllers = [TodoController];
const services = [TodoService];
const repositories = [TodoRepository];
const modules = [];

@Module({
  imports: [TypeOrmModule.forFeature(entities), ...modules],
  controllers: [...controllers],
  providers: [
    ...services,
    ...repositories,
  ],
  exports: [TodoService],
})
export class TodoModule { }
