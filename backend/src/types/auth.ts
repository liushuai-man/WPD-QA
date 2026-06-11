export interface User {
  id: string;
  email: string;
  nickname?: string;
  avatar?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ProfileResponse {
  user: User;
  createdAt: string;
}
