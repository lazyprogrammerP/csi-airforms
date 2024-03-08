import Exception from "@/lib/common/exception";
import getAuthUser from "@/lib/middlewares/get-auth-user";
import Prisma from "@/prisma";

export async function POST(request: Request, { params }: { params: { quizId: string } }) {
  try {
    const user = await getAuthUser();

    const quiz = await Prisma.quiz.findUnique({
      where: { id: parseInt(params.quizId) },
    });

    if (!quiz) {
      throw new Exception("Quiz not found.", 404);
    }

    if (quiz?.visibility === "INVITED_USERS_ONLY") {
      const userSInvitation = await Prisma.quizInvitation.findFirst({
        where: {
          quizId: parseInt(params.quizId),
          user: {
            id: user.id,
          },
        },
      });

      if (!userSInvitation) {
        throw new Exception("Unauthorized access: You are not invited to this quiz.", 401);
      }
    }

    const attempt = await Prisma.quizAttempt
      .create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          quiz: {
            connect: {
              id: parseInt(params.quizId),
            },
          },
        },
        include: {
          quiz: {
            include: {
              questions: {
                include: {
                  options: true,
                },
              },
            },
          },
        },
      })
      .then((attempt) => {
        // exclude the flag for correct answer from the options
        attempt.quiz.questions = attempt.quiz.questions.map((question) => {
          return {
            ...question,
            options: question.options.map((option) => {
              return {
                ...option,
                isCorrect: false,
              };
            }),
          };
        });

        return attempt;
      });

    return Response.json({ attempt }, { status: 200 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Something went wrong." }, { status: error instanceof Exception ? error.code : 500 });
  }
}
