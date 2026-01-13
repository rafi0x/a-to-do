export enum TodoStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export type Todo = {
  id: string;
  title: string;
  description: string;
  status: TodoStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateTodoPayload = {
  title: string;
  description?: string;
  status?: TodoStatus;
};

export type UpdateTodoPayload = {
  title?: string;
  description?: string;
  status?: TodoStatus;
};

export type FilterTodoQuery = {
  searchTerm?: string;
  status?: TodoStatus;
};
