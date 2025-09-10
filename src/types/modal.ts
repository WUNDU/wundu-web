export type ModalType = 'success' | 'error' | 'info';

export type ModalIconProps = {
  type: 'success' | 'error' | 'info';
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
  openModal: (type: ModalType, title: string, message: string, onClose?: () => void) => void;
  closeModal: () => void;
}
