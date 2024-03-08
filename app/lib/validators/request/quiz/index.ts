import { QuizVisibility } from ".prisma/client";
import { z } from "zod";

export const CreateOrUpdateQuizRequestValidator = z.object({
  title: z.string(),
  instructions: z.string(),

  duration: z.number().optional(),

  visibility: z.enum([QuizVisibility.ANYONE_WITH_A_LINK, QuizVisibility.INVITED_USERS_ONLY]),
});
