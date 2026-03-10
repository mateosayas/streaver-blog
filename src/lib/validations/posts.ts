import z from "zod";

export const postIdParamSchema = z.coerce
  .number()
  .int({ message: "id must be an integer" })
  .positive({ message: "id must be a positive number" });
