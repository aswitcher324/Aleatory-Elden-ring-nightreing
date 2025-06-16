
export interface CorsProxy {
  url: (targetUrl: string) => string;
  method: number;
  needsJsonParse?: boolean;
}
