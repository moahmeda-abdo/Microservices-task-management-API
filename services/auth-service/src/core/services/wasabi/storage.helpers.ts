import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { S3 } from "./instance.wasabi";
import { wasabiConfig } from "./wasabi.config";

export interface UploadLocalFileOptions {
  contentType?: string;
  folderName?: string;
}

export interface UploadLocalFileResult {
  fileName: string;
  cloudKey: string;
  fileUrl: string;
}

export async function uploadLocalFileToStorage(
  localFilePath: string,
  fileName: string,
  options: UploadLocalFileOptions = {}
): Promise<UploadLocalFileResult> {
  const folderEnv = options.folderName ?? process.env.STORAGE_FOLDER_NAME;
  if (!folderEnv) {
    throw new Error("STORAGE_FOLDER_NAME env variable is not defined");
  }

  const normalizedFolder = sanitizeFolderName(folderEnv);
  const key = path.posix.join(normalizedFolder, fileName);

  const fileStream = fs.createReadStream(localFilePath);

  const acl = process.env.STORAGE_S3_ACL ?? "public-read";

  await S3.upload({
    Bucket: wasabiConfig.bucket,
    Key: key,
    Body: fileStream,
    ContentType: options.contentType,
    ACL: acl,
    CacheControl: "public, max-age=86400",
  }).promise();

  await safeUnlink(localFilePath);

  const fileUrl = buildWasabiFileUrl(key);

  return {
    fileName,
    cloudKey: key,
    fileUrl,
  };
}

function sanitizeFolderName(folder: string): string {
  return folder.replace(/^\/*/, "").replace(/\/*$/, "");
}

async function safeUnlink(filePath: string): Promise<void> {
  try {
    await fsp.unlink(filePath);
  } catch (error: any) {
    if (error?.code === "ENOENT") return;
    throw error;
  }
}

function buildWasabiFileUrl(key: string): string {
  const endpoint = wasabiConfig.endpoint.replace(/\/$/, "");
  const hasProtocol = /^https?:\/\//i.test(endpoint);
  const baseUrl = hasProtocol ? endpoint : `https://${endpoint}`;
  const encodedKey = key
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");

  return `${baseUrl}/${wasabiConfig.bucket}/${encodedKey}`;
}

