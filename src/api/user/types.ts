// 登录所需的参数
export type LoginRequest = {
  username: string;
  password: string;
};

// 刷新登录信息需要的参数
export type reLoginRequest = {
  accessToken: string;
};

// 登录后返回的响应信息
export type LoginResponse = {
  username: string;
  roles: Array<string>;
  accessToken: string;
  refreshToken: string;
};