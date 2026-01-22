import axios from 'axios';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { getMessageInfo } from './status';
import { ElMessage } from 'element-plus';
import type { BaseResponse } from '@/utils/types';


// T 为 res.data.data 的类型 不同的接口会返回不同的 data 所以我们加一个泛型表示
// 此处相当于二次响应拦截
// 为响应数据进行定制化处理
export const requestInstance = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  const conf = config;
  return new Promise((resolve, reject) => {
    service
      .request<any, AxiosResponse<BaseResponse>>(conf)
      .then((res: AxiosResponse<BaseResponse>) => {
        const data = res.data;
        // 如果data.code为错误代码返回message信息
        if (data.code != 1) {
          ElMessage({
            message: data.message,
            type: 'error',
          });
          reject(data.message);
        } else {
          ElMessage({
            message: data.message,
            type: 'success',
          });
          // 此处返回data信息 也就是 api 中配置好的 Response类型
          resolve(data.data as T);
        }
      });
  });
};

const service: AxiosInstance = axios.create({
   baseURL: import.meta.env.VITE_APP_API_BASEURL,
    timeout: 15000,
  });

// axios实例拦截请求
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// axios实例拦截响应
service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200) {
      return response;
    }
    ElMessage({
      message: getMessageInfo(response.status),
      type: 'error',
    });
    return response;
  },
  // 请求失败
  (error: any) => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      ElMessage({
        message: getMessageInfo(response.status),
        type: 'error',
      });
      return Promise.reject(response.data);
    }
    ElMessage({
      message: '网络异常,请稍后再试!',
      type: 'error',
    });
  }
);

export default service