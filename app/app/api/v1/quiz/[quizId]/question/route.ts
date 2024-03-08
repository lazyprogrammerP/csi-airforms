import Exception from "@/lib/common/exception";
import getAuthUser from "@/lib/middlewares/get-auth-user";
import { CreateOrUpdateQuestionRequest } from "@/lib/types/request/quiz/[quizId]/question";
import { CreateOrUpdateQuestionRequestValidator } from "@/lib/validators/request/quiz/[quizId]/question";
import Prisma from "@/prisma";

export async function GET(request: Request, { params }: { params: { quizId: string } }) {
  try {
    const user = await getAuthUser();

    const questions = await Prisma.question.findMany({
      where: {
        quiz: {
          id: parseInt(params.quizId),
          user: {
            id: user.id,
          },
        },
      },
      include: {
        options: true,
      },
    });

    return Response.json({ questions }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Something went wrong." }, { status: error instanceof Exception ? error.code : 500 });
  }
}

export async function POST(request: Request, { params }: { params: { quizId: string } }) {
  try {
    const user = await getAuthUser();

    const payload: CreateOrUpdateQuestionRequest = await request.json();
    const payloadValidation = CreateOrUpdateQuestionRequestValidator.safeParse(payload);

    if (!payloadValidation.success) {
      throw new Exception(`An invalid request body was received:\n${payloadValidation.error}.`, 400);
    }

    const question = await Prisma.question.create({
      data: {
        question: payload.question,
        type: payload.type,
        options: {
          createMany: {
            data: payload.options.map((option) => ({
              content: option.content,
              isCorrect: option.isCorrect,
            })),
          },
        },
        awardableMarks: payload.awardableMarks,
        isRequired: payload.isRequired,
        quiz: {
          connect: {
            id: parseInt(params.quizId),
            user: {
              id: user.id,
            },
          },
        },
      },
      include: {
        options: true,
      },
    });

    return Response.json({ question }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Something went wrong." }, { status: error instanceof Exception ? error.code : 500 });
  }
}
