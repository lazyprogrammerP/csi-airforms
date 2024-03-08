import Exception from "@/lib/common/exception";
import getAuthUser from "@/lib/middlewares/get-auth-user";
import { CreateOrUpdateQuestionRequest } from "@/lib/types/request/quiz/[quizId]/question";
import { CreateOrUpdateQuestionRequestValidator } from "@/lib/validators/request/quiz/[quizId]/question";
import Prisma from "@/prisma";
import { Option } from "@prisma/client";

export async function PUT(request: Request, { params }: { params: { quizId: string; questionId: string } }) {
  try {
    const user = await getAuthUser();

    const payload: CreateOrUpdateQuestionRequest = await request.json();
    const payloadValidation = CreateOrUpdateQuestionRequestValidator.safeParse(payload);

    if (!payloadValidation.success) {
      throw new Exception(`An invalid request body was received:\n${payloadValidation.error}.`, 400);
    }

    const question = await Prisma.question.findUnique({
      where: {
        id: parseInt(params.questionId),
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

    if (!question) {
      throw new Exception(`Unauthorized access: The user does not have access to modify this question.`, 401);
    }

    const excludedOptions: Array<Option> = question.options.filter((option) => {
      return !payload.options.some((payloadOption) => option.id === payloadOption.id);
    });

    const [_, updatedQuestion] = await Prisma.$transaction([
      Prisma.option.deleteMany({
        where: {
          id: {
            in: excludedOptions.map((option) => option.id),
          },
        },
      }),
      Prisma.question.update({
        where: {
          id: parseInt(params.questionId),
          quiz: {
            id: parseInt(params.quizId),
            user: {
              id: user.id,
            },
          },
        },
        data: {
          question: payload.question,
          type: payload.type,
          awardableMarks: payload.awardableMarks,
          isRequired: payload.isRequired,
          options: {
            upsert: payload.options.map((option) => ({
              where: { id: option.id },
              update: { content: option.content, isCorrect: option.isCorrect },
              create: { content: option.content, isCorrect: option.isCorrect },
            })),
          },
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
      }),
    ]);

    return Response.json({ question: updatedQuestion }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Something went wrong." }, { status: error instanceof Exception ? error.code : 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { quizId: string; questionId: string } }) {
  try {
    const user = await getAuthUser();

    await Prisma.question.delete({
      where: {
        id: parseInt(params.questionId),
        quiz: {
          id: parseInt(params.quizId),
          user: {
            id: user.id,
          },
        },
      },
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Something went wrong." }, { status: error instanceof Exception ? error.code : 500 });
  }
}
