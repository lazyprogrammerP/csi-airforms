import { QuestionType } from ".prisma/client";
import { z } from "zod";

export const CreateOrUpdateQuestionRequestValidator = z
  .object({
    question: z.string(),
    type: z.enum([QuestionType.MCQ, QuestionType.MSQ, QuestionType.SA, QuestionType.LA]),

    options: z.array(
      z.object({
        id: z.number().optional(),
        content: z.string(),
        isCorrect: z.boolean(),
      })
    ),

    awardableMarks: z.number(),
    isRequired: z.boolean(),
  })
  .refine((schema) => {
    const numberOfOptions = schema.options.length;

    const textBasedQuestions: Array<string> = [QuestionType.SA, QuestionType.LA];
    if (textBasedQuestions.includes(schema.type)) {
      if (numberOfOptions) return false;
    }

    const optionBasedQuestions: Array<string> = [QuestionType.MCQ, QuestionType.MSQ];
    if (optionBasedQuestions.includes(schema.type)) {
      if (numberOfOptions < 2) return false;

      const numberOfCorrectOptions = schema.options.filter((option) => option.isCorrect).length;
      if (!numberOfCorrectOptions) return false;
      if (schema.type === "MCQ" && numberOfCorrectOptions > 1) return false;
    }

    if (schema.awardableMarks <= 0) return false;

    return true;
  });
