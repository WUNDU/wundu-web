import { TransactionProps } from "@/types/panel";
import React from "react";
import { Icon } from "@/ui/atoms/Icon";

export const Transaction: React.FC<TransactionProps> = ({
  icon,
  title,
  transactions,
  amount,
  percentage,
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm my-2">
      <div className="flex items-center space-x-4">
        <Icon
          initials={icon.initials}
          bgColor={icon.bgColor}
          color={icon.color}
        />
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{transactions} transações</p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-semibold ${
            amount < 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          KZ {amount.toLocaleString("pt-AO")}
        </p>
        <p className="text-sm text-gray-500">{percentage}%</p>
      </div>
    </div>
  );
};
