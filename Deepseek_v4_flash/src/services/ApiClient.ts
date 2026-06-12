import { ApiError } from '../types';

type RequestInterceptor = (config: RequestInit & { url: string }) => RequestInit & { url: string };
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

export class ApiClient {
  private baseUrl: string;
  private timeout: number = 10000;
  private maxRetries: number = 3;
  private language: string = 'en';
  private requestInterceptor: RequestInterceptor | null = null;
  private responseInterceptor: ResponseInterceptor | null = null;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || import.meta.env.VITE_API_BASE_URL || '/api';
  }

  setRequestInterceptor(interceptor: RequestInterceptor | null): void {
    this.requestInterceptor = interceptor;
  }

  setResponseInterceptor(interceptor: ResponseInterceptor | null): void {
    this.responseInterceptor = interceptor;
  }

  setLanguage(language: string): void {
    this.language = language;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = `${this.baseUrl}${endpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      }
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const request: RequestInit & { url: string } = {
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': this.language,
      },
    };

    return this.request<T>(request);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const request: RequestInit & { url: string } = {
      url: `${this.baseUrl}${endpoint}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': this.language,
      },
      body: JSON.stringify(data),
    };

    return this.request<T>(request);
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    const request: RequestInit & { url: string } = {
      url: `${this.baseUrl}${endpoint}`,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': this.language,
      },
      body: JSON.stringify(data),
    };

    return this.request<T>(request);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const request: RequestInit & { url: string } = {
      url: `${this.baseUrl}${endpoint}`,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': this.language,
      },
    };

    return this.request<T>(request);
  }

  async patch<T>(endpoint: string, data: any): Promise<T> {
    const request: RequestInit & { url: string } = {
      url: `${this.baseUrl}${endpoint}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': this.language,
      },
      body: JSON.stringify(data),
    };

    return this.request<T>(request);
  }

  private async request<T>(request: RequestInit & { url: string }): Promise<T> {
    if (this.requestInterceptor) {
      Object.assign(request, this.requestInterceptor(request));
    }

    let lastError: any;

    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        request.signal = controller.signal;

        let response = await fetch(request.url, request);

        clearTimeout(timeoutId);

        if (this.responseInterceptor) {
          response = await this.responseInterceptor(response);
        }

        if (!response.ok) {
          const errorBody = await this.parseErrorBody(response);
          throw this.normalizeError(response.status, errorBody);
        }

        const data: T = await response.json();
        return data;
      } catch (error: any) {
        if (this.isNetworkError(error) && attempt < this.maxRetries) {
          lastError = error;
          await this.delay(attempt);
          continue;
        }
        throw this.normalizeError(0, error);
      }
    }

    throw lastError;
  }

  private async parseErrorBody(response: Response): Promise<any> {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }

  private isNetworkError(error: any): boolean {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return false;
    }
    return (
      error instanceof TypeError ||
      error.name === 'TypeError' ||
      error.message?.includes('fetch') ||
      error.message?.includes('network') ||
      error.message?.includes('NetworkError')
    );
  }

  private normalizeError(status: number, error: any): ApiError {
    if (error && typeof error === 'object' && error.code && error.message) {
      return {
        code: error.code,
        message: error.message,
        messageAr: error.messageAr || error.message,
        details: error.details,
      };
    }

    if (status >= 400 && status < 500) {
      return {
        code: 'CLIENT_ERROR',
        message: error?.message || `Request failed with status ${status}`,
        messageAr: error?.message || `فشل الطلب مع الحالة ${status}`,
      };
    }

    if (status >= 500) {
      return {
        code: 'SERVER_ERROR',
        message: error?.message || `Server error with status ${status}`,
        messageAr: error?.message || `خطأ في الخادم مع الحالة ${status}`,
      };
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        code: 'TIMEOUT',
        message: 'Request timed out',
        messageAr: 'انتهت مهلة الطلب',
      };
    }

    return {
      code: 'NETWORK_ERROR',
      message: error?.message || 'Network error occurred',
      messageAr: error?.message || 'حدث خطأ في الشبكة',
    };
  }

  private delay(attempt: number): Promise<void> {
    const delayMs = Math.pow(2, attempt) * 1000;
    return new Promise((resolve) => setTimeout(resolve, delayMs));
  }
}
