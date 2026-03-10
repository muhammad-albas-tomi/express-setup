export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUserInput {
  email: string;
  password: string;
  name: string;
  role?: Role;
}

export interface IUpdateUserInput {
  email?: string;
  password?: string;
  name?: string;
  role?: Role;
  isActive?: boolean;
}

export interface IUserResponse {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: IUserResponse;
  tokens: ITokens;
}

export interface ITokens {
  accessToken: string;
  refreshToken: string;
}
