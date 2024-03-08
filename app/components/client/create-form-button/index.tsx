"use client";

import { CreateOrUpdateQuizRequest } from "@/lib/types/request/quiz";
import { Bars3BottomLeftIcon, ClockIcon, DocumentTextIcon, GlobeAltIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Select, SelectItem, Textarea, useDisclosure } from "@nextui-org/react";
import { QuizVisibility } from "@prisma/client";
import axios, { AxiosError } from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const visibilityOptions = [
  { id: 1, label: "Anyone With A Link", value: QuizVisibility.ANYONE_WITH_A_LINK },
  { id: 2, label: "Invited Users Only", value: QuizVisibility.INVITED_USERS_ONLY },
];

const CreateFormButton = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [creatingQuiz, setCreatingQuiz] = useState<boolean>(false);

  const handleCreateQuiz = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    setCreatingQuiz(true);

    const formData = new FormData(ev.currentTarget);
    let payload: CreateOrUpdateQuizRequest = {
      title: formData.get("title")?.toString() || "",
      instructions: formData.get("instructions")?.toString() || "",
      duration: parseInt(formData.get("duration")?.toString() || ""),
      visibility: formData.get("visibility") as QuizVisibility,
    };

    try {
      await axios.post("/api/v1/quiz", { ...payload });
      toast.success("Created the form successfully.");
      onOpenChange();
    } catch (error) {
      toast.error(error instanceof AxiosError ? error.response?.data.error : "Something unexpected went wrong. Please try again now.");
    }

    setCreatingQuiz(false);
  };

  return (
    <>
      <Button color={"primary"} onClick={onOpen}>
        <PlusCircleIcon className={"w-5 h-5"} />
        <span>Create Form</span>
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement={"center"}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create An AirForm</ModalHeader>
              <form onSubmit={handleCreateQuiz}>
                <ModalBody>
                  <Input name={"title"} variant={"flat"} startContent={<Bars3BottomLeftIcon className={"w-5 h-5 text-default-500"} />} label={"Form Title"} />
                  <Textarea name={"instructions"} variant={"flat"} startContent={<DocumentTextIcon className={"w-5 h-5 text-default-500"} />} label={"Instructions"} />
                  <Input type={"number"} name={"duration"} variant={"flat"} startContent={<ClockIcon className={"w-5 h-5 text-default-500"} />} label={"Duration"} endContent={<span className={"text-default-500 text-sm"}>minutes</span>} />
                  <Select name={"visibility"} variant={"flat"} startContent={<GlobeAltIcon className={"w-5 h-5 text-default-500"} />} label={"Visibilty"}>
                    {visibilityOptions.map((op) => (
                      <SelectItem key={op.value} value={op.value}>
                        {op.label}
                      </SelectItem>
                    ))}
                  </Select>
                </ModalBody>
                <ModalFooter>
                  <Button color={"danger"} variant={"flat"} onClick={onOpenChange}>
                    Cancel
                  </Button>
                  <Button type={"submit"} color={"primary"} variant={"flat"} isLoading={creatingQuiz}>
                    Create
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateFormButton;
