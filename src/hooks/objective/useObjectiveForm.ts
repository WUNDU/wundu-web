"use client";

import { useState } from "react";

export interface ObjectiveFormState {
  objectiveName: string;
  targetValue: string;
  dueDate: string;
  priority: string;
  category: string;
}

export const useObjectiveForm = (onSave?: (data: ObjectiveFormState) => void) => {
  const [form, setForm] = useState<ObjectiveFormState>({
    objectiveName: "",
    targetValue: "",
    dueDate: "",
    priority: "",
    category: "",
  });

  const setField = (field: keyof ObjectiveFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const save = () => {
    onSave?.(form);
  };

  return {
    form,
    setField,
    save,
  };
};
