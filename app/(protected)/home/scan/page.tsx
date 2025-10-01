import ProtectedRoute from "@/src/components/atoms/ProtectedRoute"
import ScanScreen from "@/src/components/pages/ScanScreen"

const Scan = () => {
  return (
    <ProtectedRoute>
      <ScanScreen />
    </ProtectedRoute>
  )
}

export default Scan