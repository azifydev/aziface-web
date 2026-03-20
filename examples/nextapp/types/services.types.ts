export interface ConfigsResponseData {
  device: string;
  productionKey: string;
  key: string;
  error?: {
    message: string;
  };
}

export interface CreateUserRequest {
  name: string;
  assembleUserId: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: string;
    name: string;
  };
}

export type FaceType =
  | 'enroll'
  | 'authenticate'
  | 'liveness'
  | 'photoScan'
  | 'photoMatch';
