import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TodoStatus } from '../../enums/todo.enum';

export class FilterTodoDto {
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;
}
