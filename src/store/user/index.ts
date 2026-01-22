// /src/store/user/index.ts
import { defineStore } from 'pinia';
import type { UserState } from './types';
import { loginAPI, getUserInfoAPI } from '@/api/user'; // 假设已封装相关 API

export const useUserStore = defineStore('user', {
  // 启用持久化（可选配置）
  persist: {
    key: 'user-store',
    storage: localStorage,
    // paths: ['accessToken', 'username'], // 可选：仅持久化部分字段
  },

  state: (): UserState => ({
    username: '',
    accessToken: '',
    refreshToken: '',
    roles: [],
  }),

  getters: {
    // 示例：判断用户是否已登录
    isLoggedIn(state) {
      return !!state.accessToken;
    },
    // 示例：获取用户角色字符串
    roleString(state) {
      return state.roles.join(', ');
    },
  },

  actions: {
    // 登录并保存 token 和用户信息
    async login(credentials: { username: string; password: string }) {
      try {
        const { accessToken, refreshToken } = await loginAPI(credentials);
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;

        // 获取用户详情
        const userInfo = await getUserInfoAPI();
        this.username = userInfo.username;
        this.roles = userInfo.roles || [];
      } catch (error) {
        // 清空状态并抛出错误供调用方处理
        this.logout();
        throw error;
      }
    },

    // 退出登录
    logout() {
      this.$reset(); // Pinia 提供的重置 state 方法
    },

    // 刷新 token（示例）
    async refreshAccessToken() {
      if (!this.refreshToken) return;
      // 调用 refresh API 并更新 accessToken
    },
  },
});