"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import CategoryForm, {
  type CategoryFormValues,
} from "../account/CategoryForm";
import type { CategoryFlow } from "app/utils/category-visual";
import { useCategory } from "@/hooks/use-category";
import { useLimit } from "@/hooks/use-limit";
import { useUserStore } from "@/store/user-store";

type OpenCategoryFormOptions = {
  /** Fluxo pré-seleccionado no form (por omissão "EXPENSE"). */
  flow?: CategoryFlow;
  /** Chamado com o nome da categoria criada (para auto-seleccionar no form de origem). */
  onCreated?: (name: string) => void;
};

type CategoryActionContextValue = {
  openCategoryForm: (options?: OpenCategoryFormOptions) => void;
};

const CategoryActionContext =
  createContext<CategoryActionContextValue | null>(null);

export function useCategoryAction() {
  const context = useContext(CategoryActionContext);
  if (!context) {
    throw new Error(
      "useCategoryAction must be used within CategoryActionProvider",
    );
  }
  return context;
}

/**
 * Form lateral global de "Nova categoria" (o mesmo de /home/categories).
 * Permite criar categorias a partir de qualquer dropdown (transações, metas)
 * sem sair do form de origem — a categoria criada é auto-seleccionada.
 */
export default function CategoryActionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [flow, setFlow] = useState<CategoryFlow>("EXPENSE");
  const onCreatedRef = useRef<((name: string) => void) | null>(null);
  const { createCategory } = useCategory();
  const { defineLimit } = useLimit();
  const userRole = useUserStore((s) => s.user?.role);

  const openCategoryForm = useCallback(
    (options?: OpenCategoryFormOptions) => {
      setFlow(options?.flow ?? "EXPENSE");
      onCreatedRef.current = options?.onCreated ?? null;
      setIsFormOpen(true);
    },
    [],
  );

  function closeCategoryForm() {
    setIsFormOpen(false);
    onCreatedRef.current = null;
  }

  async function handleSave(values: CategoryFormValues): Promise<boolean> {
    const created = await createCategory({
      name: values.name,
      flow: values.flow,
    });
    if (!created) return false;
    if (values.limit != null) {
      const ok = await defineLimit({
        categoryId: created.id,
        monthlyLimit: values.limit,
      });
      if (!ok) return false;
    }
    onCreatedRef.current?.(created.name);
    return true;
  }

  return (
    <CategoryActionContext.Provider value={{ openCategoryForm }}>
      {children}
      <CategoryForm
        isOpen={isFormOpen}
        mode="create"
        defaultFlow={flow}
        canManage={userRole === "ADMIN"}
        onClose={closeCategoryForm}
        onBack={closeCategoryForm}
        onSave={handleSave}
      />
    </CategoryActionContext.Provider>
  );
}
