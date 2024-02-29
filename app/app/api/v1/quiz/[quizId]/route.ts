import Exception from "@/lib/common/exception";
import getAuthUser from "@/lib/middlewares/get-auth-user";
import { CreateOrUpdateQuizRequest } from "@/lib/types/request/quiz";
import { CreateOrUpdateQuizRequestValidator } from "@/lib/validators/request/quiz";
import Prisma from "@/prisma";

export async function PUT(request: Request, { params }: { params: { quizId: string } }) {
  try {
    const user = await getAuthUser();

    const payload: CreateOrUpdateQuizRequest = await request.json();
    const payloadValidation = CreateOrUpdateQuizRequestValidator.safeParse(payload);

    if (!payloadValidation.success) {
      throw new Exception(`An invalid request body was received:\n${payloadValidation.error}.`, 400);
    }

    const quiz = await Prisma.quiz.update({
      where: {
        id: parseInt(params.quizId),
        user: {
          id: user.id,
        },
      },
      data: {
        title: payload.title,
        instructions: payload.instructions,
        duration: payload.duration,
        visibility: payload.visibility,
        updatedAT: new Date(),
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return Response.json({ quiz }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Something went wrong." }, { status: error instanceof Exception ? error.code : 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { quizId: string } }) {
  try {
    const user = await getAuthUser();

    await Prisma.quiz.delete({
      where: {
        id: parseInt(params.quizId),
        user: {
          id: user.id,
        },
      },
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Something went wrong." }, { status: error instanceof Exception ? error.code : 500 });
  }
}
