export interface WasabiConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  endpoint: string;
  bucket: string;
}

export const wasabiConfig: WasabiConfig = {
  accessKeyId: process.env.STORAGE_S3_ACCESS_KEY!,
  secretAccessKey: process.env.STORAGE_S3_SECRET_KEY!,
  region: process.env.STORAGE_S3_REGION!,
  endpoint: process.env.STORAGE_S3_ENDPOINT!,
  bucket: process.env.STORAGE_S3_BUCKET!,
};
