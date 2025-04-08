export interface LoginParams {
  username: string;
  password: string;
  remember?: boolean;
}

export interface UserInfo {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  email?: string;
  role: string;
  token: string;
}

export interface LoginResult {
  status: 'success' | 'error';
  message?: string;
  data?: {
    token: string;
    userInfo: UserInfo;
  };
} 