"use client";

import { CTA } from "@/shared/components";
import { TextInput } from "@/shared/components";
import { Button } from "@/shared/components";
import { useEmailPhone } from "@/hooks/auth/use-email-phone";
import { Header } from "@/shared/components";
import { COUNTRIES } from "@/constants/countries";
import { NavigationBack } from "@/shared/components";

const EmailPhone = () => {
  const {
    phoneNumber,
    setPhoneNumber,
    countryCode,
    setCountryCode,
    isError,
    submit,
  } = useEmailPhone();

  return (
    <div className="flex h-full flex-col gap-y-8 justify-between p-4 md:gap-y-6 md:justify-start md:p-0">
      <NavigationBack />
      {/* Header - apenas mobile */}
      <div className="block md:hidden">
        <Header title="Perdeu a sua senha?" />
      </div>

      <div className="w-full text-left md:text-center">
        <CTA
          title="Perdeu a sua senha?"
          subtitle="Digite seu número telefónico e enviaremos um código de verificação."
          variant="default"
        />
      </div>

      <form
        onSubmit={submit}
        className="flex w-full flex-col gap-y-8 px-4 md:px-0 md:gap-y-6"
      >
        <div className="flex items-center gap-2">
          <select
            name="countryCode"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="w-auto rounded-xl border border-gray-300 px-4 py-3 m-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 md:rounded-lg"
          >
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.code}
              </option>
            ))}
          </select>
          <TextInput
            id="phone-number"
            label=""
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Digite seu nº de telefone"
            isError={isError}
            maxLength={9}
            required
          />
        </div>
        {isError && (
          <p className="text-sm text-red-500 -mt-4 md:text-center">
            Por favor, insira um número de telefone válido.
          </p>
        )}
        <Button onClick={() => {}} type="submit">
          Continuar
        </Button>
      </form>

      {/* Spacer apenas para mobile */}
      <div className="mt-auto h-1/4 md:hidden"></div>
    </div>
  );
};

export default EmailPhone;
