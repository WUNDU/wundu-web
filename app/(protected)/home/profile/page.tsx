import ProtectedRoute from "@/src/components/atoms/ProtectedRoute";
import ProfileScreen from "@/src/components/pages/ProfileScreen";


export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileScreen />
    </ProtectedRoute>
  )
}