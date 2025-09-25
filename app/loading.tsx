import LoadingSpinner from "@/src/components/atoms/LoadingSpinner"

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <LoadingSpinner />
    </div>
  )
}

export default Loading