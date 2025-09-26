import ProtectedRoute from "@/src/components/atoms/ProtectedRoute";
import ArticleDetailScreen from "@/src/components/pages/ArticleDetailScreen";


export default function Library() {
  return (
    <ProtectedRoute>
      <ArticleDetailScreen />
    </ProtectedRoute>

  )
}