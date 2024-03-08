"use client";

import { Quiz } from "@prisma/client";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

// CLEAN AND COMPLETE THIS COMPONENT FROM HERE

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
    <div>
      {loadingQuizzes ? "Loading..." : ""}
      {quizzes.map((quiz) => (
        <div>{quiz.title}</div>
      ))}
    </div>
  );
};

export default FormList;
