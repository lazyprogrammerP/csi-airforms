import { z } from "zod";

export const CreateOrUpdateAnswerRequestValidator = z
  .object({
    selectedOptions: z
      .array(
        z.object({
          id: z.number(),
        })
      )
      .optional(),
    answeredContent: z.string().optional(),
  })
  .refine((schema) => {
    if (!schema.selectedOptions?.length && !schema.answeredContent) {
      return false;
    }

    return true;
  });
