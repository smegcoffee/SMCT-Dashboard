import { Providers } from "@/components/providers"
import { DashboardPage } from "./(dashboard)/page"

export default function Home() {
  return (
    <Providers>
      <DashboardPage />
    </Providers>
  )
}

