import type { Goal } from "@/services/goals-service";

export type ModalType = "success" | "error" | "info" | null;

export type ModalIconProps = {
  type: "success" | "error" | "info" | null;
};

export type ModalContentProps = {
  type: ModalType;
  title: string;
  message: string;
};

export interface ModalState {
  isOpen: boolean;
  type: ModalType | null;
  title: string;
  message: string;
  onClose: () => void;
  openModal: (
    type: ModalType,
    title: string,
    message: string,
    onClose?: () => void,
  ) => void;
  closeModal: () => void;
}

export interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export interface DetailsModalProps {
  onClose: () => void;
}

export interface SuccessModalProps {
  onClose: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

export interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  objective: Goal | null;
  onUpdated?: () => void;
}

export interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (transaction: {
    type: string;
    amount: number;
    description: string;
    transactionDate: string;
    category_id: string;
  }) => void;
}
