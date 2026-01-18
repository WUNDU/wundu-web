"use client";

import { useEffect, useState } from "react";
import { usePasswordResetContext } from "@/contexts/password-reset-context";

export const useVerification = () => {
  const {
    nextStep,
    timer,
    setTimer,
    resetTimer,
    isCodeIncorrect,
    setIsCodeIncorrect,
  } = usePasswordResetContext();

  const [code, setCode] = useState("");
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer, setTimer]);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const isRed = timer <= 30;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === "123456") {
      setIsCodeIncorrect(false);
      setIsCodeCorrect(true);
      setTimeout(() => {
        nextStep();
      }, 500);
    } else {
      setIsCodeIncorrect(true);
      setIsCodeCorrect(false);
    }
  };

  return {
    code,
    setCode,
    isCodeCorrect,
    isCodeIncorrect,
    minutes,
    seconds,
    isRed,
    resetTimer,
    submit,
  };
};
