import { Model, Schema } from "mongoose";
import crypto from "crypto";


function generateShortId(prefix: string, length: number = 8): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return `${prefix}_${result}`;
}

export function shortIdPlugin<T>(
  schema: Schema<T>,
  options: {
    prefix: string;
    length?: number; // default = 8
  }
) {
  const field = "id";
  const { prefix, length = 8 } = options;

  schema.add({
    // @ts-ignore
    [field]: { type: String, required: true, unique: true, index: true },
  });

  schema.pre("validate", async function (next) {
    if (!this[field]) {
      while (true) {
        const shortId = generateShortId(prefix, length);

        const exists = await (this.constructor as Model<T>).exists({
          [field]: shortId,
        });

        if (!exists) {
          this[field] = shortId;
          break;
        }
      }
    }

    next();
  });
}
