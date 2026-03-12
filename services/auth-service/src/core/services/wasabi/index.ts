import fs from "fs";
import { S3 } from "./instance.wasabi";
import { wasabiConfig } from "./wasabi.config";


// ========================
// 📤 Upload from file
// ========================
export async function uploadToWasabi(buffer: ArrayBuffer, localFilePath: string, cloudKey: string) {
  const stream = fs.createReadStream(localFilePath);
  return S3.upload({
    Bucket: wasabiConfig.bucket,
    Key: cloudKey,
    Body: stream,
  }).promise();
}

// ========================
// 📤 Upload from buffer
// ========================
export async function uploadBufferToWasabi(buffer: Buffer, cloudKey: string, contentType?: string) {
  return S3.upload({
    Bucket: wasabiConfig.bucket,
    Key: cloudKey,
    Body: buffer,
    ContentType: contentType,
  }).promise();
}

// ========================
// 📥 Download to local path
// ========================
export async function downloadFromWasabi(cloudKey: string, outputPath: string): Promise<void> {
  const file = fs.createWriteStream(outputPath);

  return new Promise<void>((resolve, reject) => {
    S3.getObject({
      Bucket: wasabiConfig.bucket,
      Key: cloudKey,
    })
      .createReadStream()
      .on("end", resolve)
      .on("error", reject)
      .pipe(file);
  });
}

// ========================
// ❌ Remove from Wasabi
// ========================
export async function removeFromWasabi(cloudKey: string): Promise<void> {
  try {
    await S3.deleteObject({
      Bucket: wasabiConfig.bucket,
      Key: cloudKey,
    }).promise();

    console.log(`✅ Deleted from Wasabi: ${cloudKey}`);
  } catch (error) {
    console.error(`❌ Failed to delete ${cloudKey}`, error);
    throw error;
  }
}

// ========================
// 📤 Upload File object (from browser/form)
// ========================
export async function uploadToWasabiWithFile(file: File, cloudKey?: string) {
  const buffer = await file.arrayBuffer();
  const key = cloudKey ?? file.name;
  const contentType = file.type || undefined;

  return uploadBufferToWasabi(Buffer.from(buffer), key, contentType);
}


export const Wasabi = {
  uploadWithFilePath: uploadToWasabi,
  uploadBuffer: uploadBufferToWasabi,
  download: downloadFromWasabi,
  remove: removeFromWasabi,
  uploadFile: uploadToWasabiWithFile
}

export { S3 };

export * from "./storage.helpers";
