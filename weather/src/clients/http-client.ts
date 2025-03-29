export interface HttpClient {
  get<T>(url: string, headers?: Record<string, string>): Promise<T>;
}

export class FetchHttpClient implements HttpClient {
  async get<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
    try {
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, url: ${url}`);
      }

      return await response.json() as T;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`HTTP request failed: ${error.message}`);
      }
      throw new Error('HTTP request failed with unknown error');
    }
  }
}