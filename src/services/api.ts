import axios, {
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export type RequestConfig = Partial<InternalAxiosRequestConfig> & {
  skipAuth?: boolean;
  headers?: AxiosRequestHeaders | Record<string, any>;
};

class ApiService {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    // ======================
    // Request Interceptor
    // ======================
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const cfg = config as RequestConfig;

        cfg.headers = (cfg.headers || {}) as any;

        // Content-Type (default JSON)
        if (!(cfg.headers as any)["Content-Type"]) {
          (cfg.headers as any)["Content-Type"] = "application/json";
        }

        // Authorization token
        if (!cfg.skipAuth) {
          const token = localStorage.getItem("token");
          if (token) {
            (cfg.headers as any)["Authorization"] = `Bearer ${token}`;
          }
        }

        // Subscription key
        if (!(cfg.headers as any)["X-Api-Subscription-Key"]) {
          (cfg.headers as any)["X-Api-Subscription-Key"] =
            import.meta.env.VITE_API_SUBSCRIPTION_KEY;
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    // ======================
    // Response Interceptor
    // ======================
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status;

        // Optional: handle unauthorized globally
        if (status === 401) {
          console.warn("Unauthorized - redirecting to login");
          localStorage.removeItem("token");

          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }

        return Promise.reject(error);
      },
    );
  }

  // ======================
  // HTTP Methods
  // ======================
  get<T = any>(url: string, config?: RequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  post<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  put<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  patch<T = any>(
    url: string,
    data?: any,
    config?: RequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }

  delete<T = any>(
    url: string,
    config?: RequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }
}

export const api = new ApiService();
