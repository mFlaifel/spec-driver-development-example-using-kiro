import { ApiError } from '../types';

interface RequestOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string | number | boolean>;
  timeout?: number;
}

function createApiError(code: string, message: string, messageAr: string): ApiError {
  return { code, message, messageAr };
}

function normalizeError(error: unknown): ApiError {
  if (error instanceof Error) {
    if (error.name === 'AbortError') {
      return createApiError('TIMEOUT', 'Request timed out', 'انتهت مهلة الطلب');
    }
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      return createApiError('NETWORK_ERROR', 'Network error. Please check your connection.', 'خطأ في الشبكة. يرجى التحقق من اتصالك.');
    }
    return createApiError('UNKNOWN_ERROR', error.message, 'حدث خطأ غير معروف');
  }
  return createApiError('UNKNOWN_ERROR', 'An unknown error occurred', 'حدث خطأ غير معروف');
}

function buildQueryString(params?: Record<string, string | number | boolean>): string {
  if (!params) return '';
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const DEFAULT_TIMEOUT = 10000;

let retryCount = 0;
const MAX_RETRIES = 3;

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const apiClient = {
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>, timeout?: number): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'GET',
      params,
      timeout,
    });
  },

  async post<T>(endpoint: string, data?: any, timeout?: number): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data,
      timeout,
    });
  },

  async put<T>(endpoint: string, data?: any, timeout?: number): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data,
      timeout,
    });
  },

  async delete<T>(endpoint: string, timeout?: number): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      timeout,
    });
  },

  async patch<T>(endpoint: string, data?: any, timeout?: number): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data,
      timeout,
    });
  },

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', headers = {}, body, params, timeout = DEFAULT_TIMEOUT } = options;
    
    const url = `${API_BASE_URL}${endpoint}${buildQueryString(params)}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': localStorage.getItem('language') || 'en',
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
        } catch {
          errorData = {};
        }
        
        throw createApiError(
          errorData.code || `HTTP_${response.status}`,
          errorData.message || `Request failed with status ${response.status}`,
          errorData.messageAr || `فشل الطلب بالحالة ${response.status}`
        );
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text() as unknown as T;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (retryCount < MAX_RETRIES && !(error instanceof Error && error.name === 'AbortError')) {
        retryCount++;
        const backoffDelay = Math.pow(2, retryCount) * 1000;
        await delay(backoffDelay);
        return this.request<T>(endpoint, options);
      }
      
      retryCount = 0;
      throw normalizeError(error);
    }
  },
};
