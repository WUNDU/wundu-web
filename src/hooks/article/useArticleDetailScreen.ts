"use client";

import { useState } from "react";

export const useArticleDetailScreen = () => {
  const [showModal, setShowModal] = useState(false);

  const handleBack = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const handleDownload = () => setShowModal(true);

  const handleConfirmDownload = () => {
    setShowModal(false);
  };

  return {
    showModal,
    setShowModal,
    handleBack,
    handleDownload,
    handleConfirmDownload,
  };
};
