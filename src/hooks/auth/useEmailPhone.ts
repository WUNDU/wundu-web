"use client";

import { useState } from "react";
import { usePasswordResetContext } from "@/contexts/PasswordResetContext";
import { validatePhoneNumber } from "@/utils/validation";
import { COUNTRIES } from "@/constants/countries";

export const useEmailPhone = () => {
  const { setResetData, nextStep } = usePasswordResetContext();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState(COUNTRIES[0].code);
  const [isError, setIsError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const valid = validatePhoneNumber(phoneNumber);
    if (valid) {
      setResetData({ phoneOrEmail: countryCode + phoneNumber });
      nextStep();
      setIsError(false);
    } else {
      setIsError(true);
    }
  };

  return {
    phoneNumber,
    setPhoneNumber,
    countryCode,
    setCountryCode,
    isError,
    submit,
  };
};
