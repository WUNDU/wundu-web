
import { create } from "zustand";
import { ModalState } from "../types/modal";

export const useUiStore = create<ModalState>((set) => ({
  isOpen: false,
  type: null,
  title: '',
  message: '',
  onClose: () => { },
  openModal: (type, title, message, onClose = () => { }) => set({ isOpen: true, type, title, message, onClose }),
  closeModal: () => set({ isOpen: false, type: null, title: '', message: '', onClose: () => { } }),
}));