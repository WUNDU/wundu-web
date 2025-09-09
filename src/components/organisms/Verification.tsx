'use client';

import CtaSectionLogin from "../molecules/CtaSectionLogin";
import Button from "../atoms/Button";
import { useEffect, useState } from "react";
import { usePasswordResetContext } from "@/src/contexts/PasswordResetContext";
import Header from "./Header";
import CodeInput from "../molecules/InputCode";
import { ROUTES } from "@/src/constants/routes";
import Link from "next/link";
import Clock from "../icons/Clock";


const Verification = () => {
  const { nextStep, prevStep, timer, setTimer, resetTimer, isCodeIncorrect, setIsCodeIncorrect, data } = usePasswordResetContext();
  const [code, setCode] = useState("");
  const [isCodeCorrect, setIsCodeCorrect] = useState(false);

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const isRed = timer <= 30;

  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer, setTimer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Função de teste: o código correto é "123456"
    if (code === "123456") {
      setIsCodeIncorrect(false);
      setIsCodeCorrect(true);
      setTimeout(() => {
        nextStep();
      }, 500); // Espera um momento para mostrar a borda verde antes de avançar
    } else {
      setIsCodeIncorrect(true);
      setIsCodeCorrect(false);
    }
  };

  return (
    <div className="flex h-full flex-col justify-between p-4">
      <Header title="Verificação do Código" onBack={prevStep} />
      <div className="w-full text-left">
        <CtaSectionLogin
          title="Verificação do Código"
          subtitle="Insira o código que foi enviado para o seu nº telefônico nos campos abaixo."
        />
      </div>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-8 px-4">
        <CodeInput length={6} value={code} onChange={setCode} isError={isCodeIncorrect} isSuccess={isCodeCorrect} />
        {isCodeIncorrect && (
          <p className="text-sm text-red-500 text-center">Código incorreto. Tente novamente.</p>
        )}
        <div className="flex items-center justify-between">
          <Link href={ROUTES.RESEND_CODE} className="text-sm text-gray-600" onClick={resetTimer}>
            Não recebi o código
          </Link>
          <div className={`flex items-center text-sm ${isRed ? 'text-red-500' : 'text-gray-600'}`}>
            <Clock className="mr-1" style={{ stroke: isRed ? '#EF4444' : '#49B58F' }} />
            {minutes.toString().padStart(2, '0')}:{(seconds).toString().padStart(2, '0')}
          </div>
        </div>
        <Button onClick={() => { }} type="submit">Confirmar</Button>
      </form>
      <div className="mt-auto h-1/4"></div>
    </div>
  );
};

export default Verification;
