import ProtectedRoute from "@/src/components/atoms/ProtectedRoute";
import LibraryScreen from "@/src/components/pages/LibraryScreen";


export default function Library() {
  return (
    <ProtectedRoute>
      <LibraryScreen />
    </ProtectedRoute>
  )
}