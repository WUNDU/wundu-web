"use client";
import { TextInput } from "@/ui/atoms";
import { Input as PasswordInput } from "@/ui/molecules";
import { FormSectionProps } from "@/types/form";
import { Button } from "@/ui/atoms";
import { useLoginForm } from "@/hooks/auth/use-login-form";
import LoadingSpinner from "@/ui/atoms/loading-spinner";

const FormSection: React.FC<FormSectionProps> = ({ onErrorChange }) => {
  const {
    form,
    errors,
    setField,
    submit,
    contextError,
    isSubmitting,
    isLoading,
  } = useLoginForm(onErrorChange);

  // Show loading spinner during authentication
  if (isLoading || isSubmitting) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner
          size="md"
          message={isSubmitting ? "Fazendo login..." : "Carregando..."}
        />
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-4 px-4">
      <TextInput
        id="email"
        label="Email"
        type="email"
        value={form.email}
        onChange={(e) => setField("email", e.target.value)}
        placeholder="Digite seu email"
        required
        isError={!!errors.email || !!contextError}
      />
      <PasswordInput
        id="password"
        label="Password"
        type="password"
        value={form.password}
        onChange={(e) => setField("password", e.target.value)}
        placeholder="Digite sua password"
        isError={!!errors.password || !!contextError}
        required
      />

      {(errors.password || contextError) && (
        <p className="text-red-500 text-sm mt-2">
          {errors.password || contextError}
        </p>
      )}
      <Button
        variant="warning"
        type="submit"
        disabled={isSubmitting || isLoading}
        className={isSubmitting ? "opacity-75 cursor-not-allowed" : ""}
      >
        {isSubmitting ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
};

export default FormSection;
