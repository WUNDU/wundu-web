import ProtectedRoute from "@/src/components/atoms/ProtectedRoute"
import ChatScreen from "@/src/components/pages/ChatScreen"

const Chat = () => {
  return (
    <ProtectedRoute>
      <ChatScreen />
    </ProtectedRoute>
  )
}

export default Chat