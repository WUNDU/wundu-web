"use client";

import React from 'react';
import { GenericModal } from '../components/organisms/GenericModal';

export function UiProvider() {
  return (
    <>
      <GenericModal />
      {/* Aqui você poderia adicionar um NotificationSystem se quisesse, para ter ambos no mesmo provedor. */}
    </>
  );
}
