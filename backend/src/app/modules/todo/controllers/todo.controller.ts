import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  ValidationPipe
} from '@nestjs/common';
import { TodoService } from '../services/todo.service';
import { CreateTodoDto, FilterTodoDto, UpdateTodoDto } from '../dto';
import { SuccessResponse } from 'src/app/types';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Post()
  async create(
    @Body(ValidationPipe) createTodoDto: CreateTodoDto,
  ): Promise<SuccessResponse> {
    return await this.todoService.create(createTodoDto);
  }

  @Get()
  async findAll(@Query(ValidationPipe) query: FilterTodoDto): Promise<SuccessResponse> {
    return await this.todoService.findAll(query);
  }

  @Get(':id')
  async findById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SuccessResponse> {
    return await this.todoService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) updateTodoDto: UpdateTodoDto,
  ): Promise<SuccessResponse> {
    return await this.todoService.update(id, updateTodoDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<SuccessResponse> {
    return await this.todoService.delete(id);
  }
}
