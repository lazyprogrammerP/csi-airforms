import Exception from "@/lib/common/exception";
import getAuthUser from "@/lib/middlewares/get-auth-user";
import { CreateOrUpdateAnswerRequest } from "@/lib/types/request/attempt/[attemptId]/answer/[questionId]";
import { CreateOrUpdateAnswerRequestValidator } from "@/lib/validators/request/attempt/[attemptId]/answer/[questionId]";
import Prisma from "@/prisma";

export async function PUT(request: Request, { params }: { params: { attemptId: string; questionId: string; answerId: string } }) {
  try {
    const user = await getAuthUser();

    const attempt = await Prisma.quizAttempt.findUnique({
      where: {
        id: parseInt(params.attemptId),
        user: {
          id: user.id,
        },
      },
      include: {
        quiz: true,
      },
    });

    if (!attempt) {
      throw new Exception("Attempt not found.", 404);
    }

    if (attempt.status === "SUBMITTED") {
      throw new Exception("Unauthorized access: Attempt is already completed.", 401);
    }

    const attemptStartedAtTimestamp = attempt.startedAt.getTime();
    const currentTimestamp = new Date().getTime();

    const attemptedDuration = currentTimestamp - attemptStartedAtTimestamp;
    if (attempt.quiz.duration) {
      const allowedDurationInMilliseconds = attempt.quiz.duration * 60 * 1000;
      if (attemptedDuration >= allowedDurationInMilliseconds) {
        throw new Exception("Unauthorized access: Time is up.", 401);
      }
    }

    const payload: CreateOrUpdateAnswerRequest = await request.json();
    const payloadValidation = CreateOrUpdateAnswerRequestValidator.safeParse(payload);

    if (!payloadValidation.success) {
      throw new Exception(`An invalid request body was received:\n${payloadValidation.error}.`, 400);
    }

    const answer = await Prisma.answer.update({
      where: {
        id: parseInt(params.answerId),
        question: {
          id: parseInt(params.questionId),
        },
        attempt: {
          id: attempt.id,
        },
      },
      data: {
        selectedOptions: {
          connect: payload.selectedOptions?.map((option) => ({
            id: option.id,
          })),
        },
        answeredContent: payload.answeredContent,
      },
    });

    return Response.json({ answer }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Something went wrong." }, { status: error instanceof Exception ? error.code : 500 });
  }
}
