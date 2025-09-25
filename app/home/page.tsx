import HomeScreen from "@/src/components/pages/HomeScreen";

export default async function Home() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return (
    <HomeScreen />
  )
}