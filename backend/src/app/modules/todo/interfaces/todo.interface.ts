import { Todo } from '../entities/todo.entity';
import { TodoStatus } from '../enums/todo.enum';

export interface FindAllOptions {
  status?: TodoStatus;
  title?: string;
  searchTerm?: string;
}

export interface ITodoRepository {
  create(todo: Partial<Todo>): Promise<Todo>;
  findAll(options?: FindAllOptions): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  update(id: string, data: Partial<Todo>): Promise<Todo | null>;
  delete(id: string): Promise<void>;
}
