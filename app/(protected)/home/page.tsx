import ProtectedRoute from "@/src/components/atoms/ProtectedRoute";
import HomeScreen from "@/src/components/pages/HomeScreen";

export default async function Home() {
  return (
    <ProtectedRoute>
      <HomeScreen />
    </ProtectedRoute>
  )
}