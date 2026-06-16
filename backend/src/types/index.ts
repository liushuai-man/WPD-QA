// 类型定义
export interface ApiResponse<T = unknown> {
  code: number;
  data?: T;
  message: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}


