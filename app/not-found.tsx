"use client";
import { logotype } from "@/constants/images";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <Image src={logotype} alt="Wundu Logo" className="mb-8 h-10 w-auto" />
      <h1 className="text-4xl font-bold text-gray-800">
        404 - Página Não Encontrada
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Desculpe, a página que você está procurando não existe ou não está
        disponível.
      </p>
      <Link
        href={ROUTES.LANDINGPAGE}
        className="mt-6 text-slate-700 font-semibold hover:underline"
      >
        Voltar para a página inicial
      </Link>
    </div>
  );
};

export default NotFound;
