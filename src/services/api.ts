/*
 Basic API service for fetch with unified error handling, timeouts, and JSON parsing.
 Extensible and framework-agnostic. Suitable for Next.js (client or server) usage.
*/

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiServiceOptions {
  baseUrl?: string;
  defaultHeaders?: Record<string, string>;
  timeoutMs?: number; // request timeout, default 20s
}

export interface RequestOptions<TBody = unknown> {
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: TBody;
  signal?: AbortSignal;
  timeoutMs?: number; // override per-request timeout
}

export class ApiError extends Error {
  public status: number;
  public data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export class ApiService {
  private baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly timeoutMs: number;

  constructor(options: ApiServiceOptions = {}) {
    const envBase =
      typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_BASE_URL
        ? String(process.env.NEXT_PUBLIC_API_BASE_URL)
        : undefined;

    this.baseUrl = options.baseUrl || envBase || "";
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json, text/plain;q=0.9, */*;q=0.8",
      ...options.defaultHeaders,
    };
    this.timeoutMs = options.timeoutMs ?? 20_000;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  private buildUrl(path: string, query?: RequestOptions["query"]) {
    const url = new URL(path, this.baseUrl || undefined);
    if (query) {
      Object.entries(query).forEach(([k, v]) => {
        if (v === undefined || v === null) return;
        url.searchParams.set(k, String(v));
      });
    }
    return url.toString();
  }

  private composeSignal(timeoutMs: number, external?: AbortSignal) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(new DOMException("Timeout", "TimeoutError")), timeoutMs);

    const clear = () => clearTimeout(timer);

    if (external) {
      if (external.aborted) controller.abort(external.reason);
      external.addEventListener("abort", () => controller.abort(external.reason), { once: true });
    }

    return { signal: controller.signal, dispose: clear };
  }

  private async request<TResponse = unknown, TBody = unknown>(
    method: HttpMethod,
    path: string,
    options: RequestOptions<TBody> = {}
  ): Promise<TResponse> {
    const { headers, query, body, signal, timeoutMs } = options;

    const url = this.buildUrl(path, query);

    const timeout = timeoutMs ?? this.timeoutMs;
    const { signal: combinedSignal, dispose } = this.composeSignal(timeout, signal);

    try {
      const res = await fetch(url, {
        method,
        headers: { ...this.defaultHeaders, ...headers },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: combinedSignal,
      });

      const contentType = res.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      let data: unknown = undefined;

      if (isJson) {
        // some APIs return 204 without body
        data = res.status !== 204 ? await res.json().catch(() => undefined) : undefined;
      } else {
        data = await res.text().catch(() => undefined);
      }

      if (!res.ok) {
        const msg = (data && typeof data === "object" && (data as any).message) || res.statusText || "Request failed";
        throw new ApiError(String(msg), res.status, data);
      }

      return data as TResponse;
    } catch (err: any) {
      if (err?.name === "AbortError") {
        throw new ApiError("Request aborted", 0, null);
      }
      if (err instanceof ApiError) throw err;
      throw new ApiError(err?.message || "Network error", 0, null);
    } finally {
      dispose();
    }
  }

  get<T = unknown>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", path, options);
  }

  post<T = unknown, B = unknown>(path: string, options?: RequestOptions<B>): Promise<T> {
    return this.request<T, B>("POST", path, options);
  }

  put<T = unknown, B = unknown>(path: string, options?: RequestOptions<B>): Promise<T> {
    return this.request<T, B>("PUT", path, options);
  }

  patch<T = unknown, B = unknown>(path: string, options?: RequestOptions<B>): Promise<T> {
    return this.request<T, B>("PATCH", path, options);
  }

  delete<T = unknown>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("DELETE", path, options);
  }
}

// Provide a shared, configurable instance. You can also create your own via `new ApiService()` if needed.
export const api = new ApiService();
