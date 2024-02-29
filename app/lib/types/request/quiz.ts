import { CreateOrUpdateQuizRequestValidator } from "@/lib/validators/request/quiz";
import { z } from "zod";

export type CreateOrUpdateQuizRequest = z.infer<typeof CreateOrUpdateQuizRequestValidator>;
