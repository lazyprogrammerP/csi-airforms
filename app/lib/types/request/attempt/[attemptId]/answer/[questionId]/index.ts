import { CreateOrUpdateAnswerRequestValidator } from "@/lib/validators/request/attempt/[attemptId]/answer/[questionId]";
import { z } from "zod";

export type CreateOrUpdateAnswerRequest = z.infer<typeof CreateOrUpdateAnswerRequestValidator>;
