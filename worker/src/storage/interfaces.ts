export type StoredObject = {
  key: string;
  url?: string;
  bytes: number;
  sha256: string;
  contentType?: string;
  meta?: Record<string, string>;
};

export interface StorageDriver {
  putObject(params: { key: string; filePath: string; contentType?: string; meta?: Record<string, string> }): Promise<StoredObject>;
}
