import ProtectedRoute from "@/src/components/atoms/ProtectedRoute";
import FinancialObjectiveScreen from "@/src/components/pages/FinancialObjectiveScreen";


export default function Financial() {
  return (
    <ProtectedRoute>
      <FinancialObjectiveScreen />
    </ProtectedRoute>
  )
}