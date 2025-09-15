import { NoMovementIcon } from '@/src/constants/icons';
import React from 'react';

const SketchPanel: React.FC = () => {
  return (
    <div className="bg-gray-50 rounded-xl p-4 h-full flex items-center justify-center">
      <div className="text-center">
        <NoMovementIcon className="mx-auto mb-1 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-700 mb-1">Sem Rascunhos</h3>
        <div className="text-gray-600 text-sm">
          <p className="text-gray-600">Todos os seus rascunhos irão aparecer aqui.</p>
        </div>
      </div>
    </div>
  );
};

export default SketchPanel;