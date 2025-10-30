export type ModalType = "success" | "error" | "info";

export type ModalIconProps = {
  type: "success" | "error" | "info";
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
    onClose?: () => void
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
  objective: {
    id: number;
    title: string;
    valorAlvo: string;
    valorPoupado: string;
    percentage: number;
    categoria?: string;
    prioridade?: string;
    dataLimite?: string;
  } | null;
}

export interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (transaction: {
    type: string;
    amount: number;
    description: string;
    transaction_date: string;
    category_id: string;
  }) => void;
}
