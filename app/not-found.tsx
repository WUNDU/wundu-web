import { logo } from '@/src/constants/images';
import Image from 'next/image';
import React from 'react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <Image src={logo} alt="Wundu Logo" className="mb-8 w-20 h-auto" />
      <h1 className="text-4xl font-bold text-gray-800">404 - Página Não Encontrada</h1>
      <p className="mt-4 text-lg text-gray-600">Desculpe, a página que você está procurando não existe ou não está disponível.</p>
      <a href="/" className="mt-6 text-yellow-500 hover:underline">Voltar para a página inicial</a>
    </div>
  );
};

export default NotFound;