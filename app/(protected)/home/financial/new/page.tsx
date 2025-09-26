import ProtectedRoute from "@/src/components/atoms/ProtectedRoute";
import NewFinancialObjectiveScreen from "@/src/components/pages/NewFinancialObjectiveScreen";

export default function Financial() {
  return (
    <ProtectedRoute>
      <NewFinancialObjectiveScreen />
    </ProtectedRoute>
  )
}