// "use client";

// import React, { useEffect, useState } from "react";
// import { createPortal } from "react-dom";
// import { useUiStore } from "../../store/uiStore";
// import { ModalContent } from "../molecules/ModalConten";
// import Button from "../atoms/Button";

// export function GenericModal() {
//   const { isOpen, type, title, message, closeModal, onClose } = useUiStore();
//   const [isMounted, setIsMounted] = useState(false);
//   const [isAnimating, setIsAnimating] = useState(false);

//   // Efeito para montar o portal quando o componente é carregado
//   useEffect(() => {
//     setIsMounted(true);
//     return () => setIsMounted(false);
//   }, []);

//   // Efeito para gerenciar a animação de entrada e saída
//   useEffect(() => {
//     let timeout: NodeJS.Timeout;
//     if (isOpen) {
//       setIsAnimating(true);
//       // Fecha o modal automaticamente após 3 segundos
//       timeout = setTimeout(() => {
//         closeModal();
//       }, 3000);
//     } else {
//       timeout = setTimeout(() => {
//         setIsAnimating(false);
//       }, 500); // Duração da animação de saída
//     }
//     return () => clearTimeout(timeout);
//   }, [isOpen, closeModal]);

//   if (!isMounted || (!isAnimating && !isOpen)) {
//     return null;
//   }

//   // O fechamento manual é removido, pois o modal fecha sozinho
//   const handleClose = () => {
//     closeModal();
//     if (onClose) {
//       onClose();
//     }
//   };

//   const modalBgClass = type === "error" ? "bg-red-700" : "bg-green-600";

//   return createPortal(
//     <div
//       className={`
//         fixed inset-0 z-50 flex items-end justify-center
//         transition-colors duration-500 ease-in-out
//         ${isOpen ? "bg-black/0 bg-opacity-50" : "bg-transparent"}
//         ${!isOpen && "pointer-events-none"}
//       `}
//       onClick={handleClose}
//     >
//       <div
//         className={`
//           relative flex flex-col ${modalBgClass} shadow-lg rounded-xl
//           transition-all duration-500 ease-out transform
//           m-4 w-full sm:max-w-sm
//           ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
//         `}
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="absolute top-2 end-2">
//           <Button variant="close" onClick={handleClose} />
//         </div>
//         {type && <ModalContent type={type} title={title} message={message} />}
//       </div>
//     </div>,
//     document.body
//   );
// }
