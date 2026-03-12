import AWS from "aws-sdk";
import { wasabiConfig } from "./wasabi.config";

const s3 = new AWS.S3({
  accessKeyId: wasabiConfig.accessKeyId,
  secretAccessKey: wasabiConfig.secretAccessKey,
  region: wasabiConfig.region,
  endpoint: wasabiConfig.endpoint,
});

export const getS3 = () => s3;
export const S3 = getS3();
