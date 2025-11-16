import { AxiosError } from "axios";
import api from "../lib/api";
import type { TransactionDTO } from "../types/transaction/transaction_dto";
import type { ApiErrorResponse } from "../types/api";

export const TransactionService = {
  add: async (data: TransactionDTO) => {
    try {
      console.log(data);
      const response = await api.post("/transactions", data);
      return true;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to save transaction";
      return false;
    }
  },

  get: async () => {
    try {
      const response = await api.get("/transaction");
      return response;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to get transaction";
      return false;
    }
  },
};
