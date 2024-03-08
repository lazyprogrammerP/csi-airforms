import { CreateOrUpdateQuestionRequestValidator } from "@/lib/validators/request/quiz/[quizId]/question";
import { z } from "zod";

export type CreateOrUpdateQuestionRequest = z.infer<typeof CreateOrUpdateQuestionRequestValidator>;
