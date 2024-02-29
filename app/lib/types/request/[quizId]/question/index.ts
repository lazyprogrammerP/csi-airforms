import { CreateOrUpdateQuestionRequestValidator } from "@/lib/validators/request/[quizId]/question";
import { z } from "zod";

export type CreateOrUpdateQuestionRequest = z.infer<typeof CreateOrUpdateQuestionRequestValidator>;
