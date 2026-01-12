import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from '../entities/todo.entity';
import { FindAllOptions, ITodoRepository } from '../interfaces/todo.interface';

@Injectable()
export class TodoRepository implements ITodoRepository {
  constructor(
    @InjectRepository(Todo)
    private readonly repository: Repository<Todo>,
  ) { }

  async create(todo: Partial<Todo>): Promise<Todo> {
    const newTodo = this.repository.create(todo);
    return this.repository.save(newTodo);
  }

  async findAll(options?: FindAllOptions): Promise<Todo[]> {
    const { status, title, searchTerm } = options || {};

    const queryBuilder = this.repository.createQueryBuilder('todo');

    if (status) {
      queryBuilder.andWhere('todo.status = :status', { status });
    }

    if (title) {
      queryBuilder.andWhere('todo.title ILIKE :title', { title: `%${title}%` });
    }

    if (searchTerm) {
      queryBuilder.andWhere(
        '(todo.title ILIKE :searchTerm OR todo.description ILIKE :searchTerm)',
        { searchTerm: `%${searchTerm}%` }
      );
    }

    const data = await queryBuilder.getMany();

    return data as Todo[];
  }

  async findById(id: string): Promise<Todo | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(id: string, data: Partial<Todo>): Promise<Todo | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
