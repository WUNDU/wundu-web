import ProtectedRoute from "@/src/components/atoms/ProtectedRoute";
import FinancialProgressScreen from "@/src/components/pages/FinancialProgressScreen";

export default function Financial() {
  return (
    <ProtectedRoute>
      <FinancialProgressScreen />
    </ProtectedRoute>
  )
}