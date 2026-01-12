import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { CreateTodoDto, FilterTodoDto, UpdateTodoDto } from '../dto';
import { Todo } from '../entities/todo.entity';
import { TodoStatus } from '../enums/todo.enum';
import { TodoRepository } from '../repositories/todo.repository';
import { TodoService } from './todo.service';
import { SuccessResponse } from 'src/app/types';

describe('TodoService', () => {
  let service: TodoService;
  let repository: TodoRepository;

  const mockTodo: Todo = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Todo',
    description: 'Test Description',
    status: TodoStatus.PENDING,
    createdAt: new Date('2026-01-10T10:00:00.000Z'),
    updatedAt: new Date('2026-01-10T10:00:00.000Z'),
  };

  const mockTodoRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: TodoRepository,
          useValue: mockTodoRepository,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    repository = module.get<TodoRepository>(TodoRepository);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new todo successfully', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
        status: TodoStatus.PENDING,
      };

      mockTodoRepository.create.mockResolvedValue(mockTodo);

      const result = await service.create(createTodoDto);

      expect(result).toBeInstanceOf(SuccessResponse);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Todo Created');
      expect(result.data).toEqual(mockTodo);
      expect(mockTodoRepository.create).toHaveBeenCalledWith(createTodoDto);
      expect(mockTodoRepository.create).toHaveBeenCalledTimes(1);
    });

    it('should create a todo without optional fields', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Minimal Todo',
      };

      const minimalTodo = { ...mockTodo, description: null };
      mockTodoRepository.create.mockResolvedValue(minimalTodo);

      const result = await service.create(createTodoDto);

      expect(result).toBeInstanceOf(SuccessResponse);
      expect(result.data).toEqual(minimalTodo);
      expect(mockTodoRepository.create).toHaveBeenCalledWith(createTodoDto);
    });
  });

  describe('findAll', () => {
    it('should return all todos without filters', async () => {
      const mockTodos = [mockTodo];
      const query: FilterTodoDto = {};

      mockTodoRepository.findAll.mockResolvedValue(mockTodos);

      const result = await service.findAll(query);

      expect(result).toBeInstanceOf(SuccessResponse);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Todos Retrieved');
      expect(result.data).toEqual(mockTodos);
      expect(mockTodoRepository.findAll).toHaveBeenCalledWith({
        status: undefined,
        searchTerm: undefined,
      });
      expect(mockTodoRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return filtered todos by status', async () => {
      const mockTodos = [mockTodo];
      const query: FilterTodoDto = {
        status: TodoStatus.PENDING,
      };

      mockTodoRepository.findAll.mockResolvedValue(mockTodos);

      const result = await service.findAll(query);

      expect(result).toBeInstanceOf(SuccessResponse);
      expect(result.data).toEqual(mockTodos);
      expect(mockTodoRepository.findAll).toHaveBeenCalledWith({
        status: TodoStatus.PENDING,
        searchTerm: undefined,
      });
    });

    it('should return filtered todos by search term', async () => {
      const mockTodos = [mockTodo];
      const query: FilterTodoDto = {
        searchTerm: 'Test',
      };

      mockTodoRepository.findAll.mockResolvedValue(mockTodos);

      const result = await service.findAll(query);

      expect(result).toBeInstanceOf(SuccessResponse);
      expect(result.data).toEqual(mockTodos);
      expect(mockTodoRepository.findAll).toHaveBeenCalledWith({
        status: undefined,
        searchTerm: 'Test',
      });
    });

    it('should return filtered todos by both status and search term', async () => {
      const mockTodos = [mockTodo];
      const query: FilterTodoDto = {
        status: TodoStatus.PENDING,
        searchTerm: 'Test',
      };

      mockTodoRepository.findAll.mockResolvedValue(mockTodos);

      const result = await service.findAll(query);

      expect(result).toBeInstanceOf(SuccessResponse);
      expect(result.data).toEqual(mockTodos);
      expect(mockTodoRepository.findAll).toHaveBeenCalledWith({
        status: TodoStatus.PENDING,
        searchTerm: 'Test',
      });
    });

    it('should return empty array when no todos found', async () => {
      const query: FilterTodoDto = {};
      mockTodoRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll(query);

      expect(result).toBeInstanceOf(SuccessResponse);
      expect(result.data).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return a todo by id', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      mockTodoRepository.findById.mockResolvedValue(mockTodo);

      const result = await service.findById(id);

      expect(result).toBeInstanceOf(SuccessResponse);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Todo Retrieved');
      expect(result.data).toEqual(mockTodo);
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(id);
      expect(mockTodoRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when todo not found', async () => {
      const id = 'non-existent-id';
      mockTodoRepository.findById.mockResolvedValue(null);

      await expect(service.findById(id)).rejects.toThrow(NotFoundException);
      await expect(service.findById(id)).rejects.toThrow(
        `Todo with ID ${id} not found`,
      );
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a todo successfully', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Title',
        status: TodoStatus.IN_PROGRESS,
      };

      const updatedTodo = { ...mockTodo, ...updateTodoDto };
      mockTodoRepository.update.mockResolvedValue(updatedTodo);

      const result = await service.update(id, updateTodoDto);

      expect(result).toBeInstanceOf(SuccessResponse);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Todo Updated');
      expect(result.data).toEqual(updatedTodo);
      expect(mockTodoRepository.update).toHaveBeenCalledWith(id, updateTodoDto);
      expect(mockTodoRepository.update).toHaveBeenCalledTimes(1);
    });

    it('should update only specific fields', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      const updateTodoDto: UpdateTodoDto = {
        status: TodoStatus.DONE,
      };

      const updatedTodo = { ...mockTodo, status: TodoStatus.DONE };
      mockTodoRepository.update.mockResolvedValue(updatedTodo);

      const result = await service.update(id, updateTodoDto);

      expect(result).toBeInstanceOf(SuccessResponse);
      expect(result.data).toEqual(updatedTodo);
      expect(mockTodoRepository.update).toHaveBeenCalledWith(id, updateTodoDto);
    });

    it('should throw NotFoundException when updating non-existent todo', async () => {
      const id = 'non-existent-id';
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Title',
      };

      mockTodoRepository.update.mockResolvedValue(null);

      await expect(service.update(id, updateTodoDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(id, updateTodoDto)).rejects.toThrow(
        `Todo with ID ${id} not found`,
      );
      expect(mockTodoRepository.update).toHaveBeenCalledWith(id, updateTodoDto);
    });
  });

  describe('delete', () => {
    it('should delete a todo successfully', async () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      mockTodoRepository.findById.mockResolvedValue(mockTodo);
      mockTodoRepository.delete.mockResolvedValue(undefined);

      const result = await service.delete(id);

      expect(result).toBeInstanceOf(SuccessResponse);
      expect(result.success).toBe(true);
      expect(result.message).toBe('Todo Deleted');
      expect(result.data).toBeNull();
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(id);
      expect(mockTodoRepository.delete).toHaveBeenCalledWith(id);
      expect(mockTodoRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockTodoRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when deleting non-existent todo', async () => {
      const id = 'non-existent-id';
      mockTodoRepository.findById.mockResolvedValue(null);

      await expect(service.delete(id)).rejects.toThrow(NotFoundException);
      await expect(service.delete(id)).rejects.toThrow(
        `Todo with ID ${id} not found`,
      );
      expect(mockTodoRepository.findById).toHaveBeenCalledWith(id);
      expect(mockTodoRepository.delete).not.toHaveBeenCalled();
    });
  });
});
