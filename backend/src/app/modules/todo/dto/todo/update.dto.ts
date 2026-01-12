import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TodoStatus } from '../../enums/todo.enum';

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus;
}
