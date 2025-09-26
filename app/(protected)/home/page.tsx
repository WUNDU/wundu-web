import ProtectedRoute from "@/src/components/atoms/ProtectedRoute";
import HomeScreen from "@/src/components/pages/HomeScreen";

export default async function Home() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return (
    <ProtectedRoute>
      <HomeScreen />
    </ProtectedRoute>
  )
}