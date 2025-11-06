// import { createContext, useContext, useState, type ReactNode } from "react";

// type ModalType = "success" | "error" | "info" | null;
// const ModalContext = createContext({});

// export function ModalProvider({ children }: { children: ReactNode }) {
//   const [type, setType] = useState<ModalType>(null);

//   return (
//     <ModalContext.Provider
//       value={{ open: (t: ModalType) => setType(t), close: () => setType(null) }}
//     >
//       {children}
//       {type && (
//         <GenericModal type={type} onClose={() => setType(null)}></GenericModal>
//       )}
//     </ModalContext.Provider>
//   );
// }

// export const useModal = () => useContext(ModalContext);
