// /src/api/user/index.ts
import { post } from '@/utils/http/index';
// 导入类型
import { LoginRequest, LoginResponse, reLoginRequest } from '@/api/user/types';

// 封装登录接口
export const userLogin = async (data?: LoginRequest) => {
  return post<LoginResponse>({}, '/login', data);
};

// 封装获取用户信息接口（用于刷新或初始化用户信息）
export const refreshUserInfo = async (data?: reLoginRequest) => {
  return post<LoginResponse>({}, '/getUserInfo', data);
};

// 按照 store 中的命名习惯导出别名
export const loginAPI = userLogin;
export const getUserInfoAPI = refreshUserInfo;