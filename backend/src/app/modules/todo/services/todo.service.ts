import { Injectable, NotFoundException } from '@nestjs/common';
import { SuccessResponse } from 'src/app/types';
import { CreateTodoDto, FilterTodoDto, UpdateTodoDto } from '../dto';
import { TodoRepository } from '../repositories/todo.repository';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) { }

  async create(createTodoDto: CreateTodoDto): Promise<SuccessResponse> {
    const todo = await this.todoRepository.create(createTodoDto);
    return new SuccessResponse("Todo Created", todo);
  }

  async findAll(query: FilterTodoDto): Promise<SuccessResponse> {
    const todos = await this.todoRepository.findAll(query);
    return new SuccessResponse("Todos Retrieved", todos);
  }

  async findById(id: string): Promise<SuccessResponse> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return new SuccessResponse("Todo Retrieved", todo);
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<SuccessResponse> {
    const todo = await this.todoRepository.update(id, updateTodoDto);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return new SuccessResponse("Todo Updated", todo);
  }

  async delete(id: string): Promise<SuccessResponse> {
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    await this.todoRepository.delete(id);

    return new SuccessResponse("Todo Deleted")
  }
}
