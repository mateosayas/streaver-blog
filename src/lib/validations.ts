import { z } from "zod";

export const userIdFilterSchema = z.coerce
  .number()
  .int({ message: "userId must be an integer" })
  .positive({ message: "userId must be a positive number" })
  .optional();

export const postIdParamSchema = z.coerce
  .number()
  .int({ message: "id must be an integer" })
  .positive({ message: "id must be a positive number" });
