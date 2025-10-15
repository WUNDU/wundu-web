'use client'
import { useState } from "react";
import Input from "../atoms/Input";
import LoginButton from "../atoms/LoginButton";
import { FormSectionProps } from "@/src/types/form";
import Link from "next/link";
import { ROUTES } from "@/src/constants/routes";
import useRegisterContext from "@/src/hooks/useRegisterContext";
import { validateEmail, validatePassword } from "@/src/utils/validation";
import { useRouter } from "next/navigation";

const FormSection: React.FC<FormSectionProps> = ({ onErrorChange }) => {
  const { loginUser, error: contextError } = useRegisterContext();
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let valid = true
    const newErrors = { email: '', password: '' }

    if (!validateEmail(form.email)) {
      newErrors.email = 'Por favor, insira um email válido';
    }

    if (!validatePassword(form.password)) {
      newErrors.password = 'Senha deve ter no mínimo 8 caracteres e no máximo 12'
      valid = false
    }

    setErrors(newErrors)
    onErrorChange?.(!!newErrors.email || !!newErrors.password || !!contextError)

    if (valid) {
      try {
        await loginUser(form.email, form.password);
        router.push(ROUTES.HOME)
      } catch (err) {
        console.log('Erro de login Capturado', contextError)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4 px-4">
      <Input
        id="email"
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="Digite seu email"
        required
        isError={!!errors.email || !!contextError} />
      <Input
        id="password"
        label="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        placeholder="Digite sua password"
        isError={!!errors.password || !!contextError}
        required />

      {(errors.password || contextError) && (
        <p className="text-red-500 text-sm mt-2">{errors.password || contextError}</p>
      )}
      {/* <Link href={ROUTES.RESET_PASSWORD} className="self-end text-sm text-gray-600">
        Esqueci minha senha
      </Link> */}
      <LoginButton onClick={() => { }} type="submit">Entrar</LoginButton>
    </form>
  );
};

export default FormSection