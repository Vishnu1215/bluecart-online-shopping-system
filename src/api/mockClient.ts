/**
 * Mock API Client with simulated network latency (200-500ms) and standard HTTP response envelopes.
 */

export interface ApiResponse<T = any> {
  status: number;
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function simulateLatency(minMs: number = 200, maxMs: number = 400): Promise<void> {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function okResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    status: 200,
    success: true,
    data,
    message
  };
}

export function createdResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    status: 201,
    success: true,
    data,
    message
  };
}

export function errorResponse(status: number, message: string): ApiResponse<any> {
  return {
    status,
    success: false,
    error: message,
    message
  };
}
