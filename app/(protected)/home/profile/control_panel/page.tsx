import ProtectedRoute from "@/src/components/atoms/ProtectedRoute"
import ControlPanelDashboardScreen from "@/src/components/pages/ControlPanelDashboardScreen"


const ControlPanel = () => {
  return (
    <ProtectedRoute>
      <ControlPanelDashboardScreen />
    </ProtectedRoute>
  )
}

export default ControlPanel