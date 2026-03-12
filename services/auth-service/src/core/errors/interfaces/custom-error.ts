import { FORMATTED_ERROR } from "./formatted_error";

export interface CUSTOM_ERROR {
  status: number;
  serial?: string;
  serialize: () => FORMATTED_ERROR[]
}