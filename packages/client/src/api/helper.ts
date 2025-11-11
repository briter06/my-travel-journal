import axios, { AxiosRequestConfig } from 'axios';
import { environment } from '../env/environment';
import { getFromStorage } from '../utils/storage';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export const callAPI = async <T = object>(
  method: HttpMethod,
  path: string,
  config: {
    payload?: object;
    queryParams?: Record<string, string | number>;
  } = {},
): Promise<T | null> => {
  try {
    const request: AxiosRequestConfig = {
      method,
      url: `${environment.apiUrl}${path}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getFromStorage('token')}`,
      },
      ...(config.payload != null ? { data: config.payload } : {}),
      ...(config.queryParams != null ? { params: config.queryParams } : {}),
    };
    const result = await axios.request<{ status: boolean; data: T }>(request);
    if (!result.data.status) {
      return null;
    }
    return result.data.data;
  } catch (_err) {
    return null;
  }
};
