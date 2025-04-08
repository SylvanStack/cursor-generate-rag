import { LoginParams, LoginResult, UserInfo } from '../interface/user';

// 模拟登录API
export const login = async (params: LoginParams): Promise<LoginResult> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 模拟登录验证
  if (params.username === 'admin' && params.password === 'admin123') {
    const userInfo: UserInfo = {
      id: '1',
      username: 'admin',
      name: '管理员',
      role: 'admin',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      email: 'admin@example.com',
      token: 'mock-token-admin',
    };
    
    return {
      status: 'success',
      data: {
        token: 'mock-token-admin',
        userInfo,
      },
    };
  }
  
  // 登录失败
  return {
    status: 'error',
    message: '用户名或密码错误',
  };
};

// 模拟获取用户信息API
export const getUserInfo = async (): Promise<UserInfo> => {
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: '1',
    username: 'admin',
    name: '管理员',
    role: 'admin',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    email: 'admin@example.com',
    token: 'mock-token-admin',
  };
}; 