"use client";

import grotesk from "@/assets/fonts/grotesk";
import { ClockIcon, EllipsisVerticalIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { Button, CircularProgress } from "@nextui-org/react";
import { Quiz, QuizVisibility } from "@prisma/client";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const visibilityToText = {
  [QuizVisibility.ANYONE_WITH_A_LINK]: "Anyone With A Link",
  [QuizVisibility.INVITED_USERS_ONLY]: "Invited Users Only",
};

const FormList = () => {
  const [loadingQuizzes, setLoadingQuizzes] = useState<boolean>(true);
  const [quizzes, setQuizzes] = useState<Array<Quiz>>([]);

  const fetchQuizzes = async () => {
    try {
      const quizzesResponse = await axios.get<any, AxiosResponse<{ quizzes: Array<Quiz> }>>("/api/v1/quiz");
      setQuizzes(quizzesResponse.data.quizzes);
    } catch (error) {
      toast.error(error instanceof AxiosError ? error.response?.data.error : "Something unexpected went wrong. Please try again now.");
    }
  };

  useEffect(() => {
    fetchQuizzes().then(() => {
      setLoadingQuizzes(false);
    });
  }, []);

  // TODO: start back from here
  return (
    <div className={"py-4"}>
      {loadingQuizzes && (
        <div className={"w-full flex items-center justify-center gap-2"}>
          <CircularProgress />
          <h3 className={`text-lg font-bold ${grotesk.className}`}>Please wait while we load the Quizzes.</h3>
        </div>
      )}

      <div className={"grid grid-cols-12 gap-4"}>
        {quizzes.map((quiz) => (
          <div key={quiz.id} className={"col-span-4 p-4 space-y-2 bg-default-50 bg-opacity-50 rounded-lg"}>
            <div className={"flex items-center justify-between"}>
              <h3 className={`text-lg font-bold ${grotesk.className}`}>{quiz.title}</h3>

              <div className={"flex items-center justify-end gap-2"}>
                <Button color={"default"} variant={"flat"} isIconOnly>
                  <EllipsisVerticalIcon className={"w-3.5 h-3.5"} />
                </Button>
              </div>
            </div>

            <div className={"w-full flex items-center gap-4"}>
              <div className={"flex items-center gap-1 text-default-500"}>
                <GlobeAltIcon className={"w-5 h-5"} />
                <span className={"text-sm font-medium"}>{visibilityToText[quiz.visibility]}</span>
              </div>

              <div className={"flex items-center gap-1 text-default-500"}>
                <ClockIcon className={"w-5 h-5"} />
                <span className={"text-sm font-medium"}>{quiz.duration} minutes</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormList;
