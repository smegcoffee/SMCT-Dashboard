import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Chat Application - Corporate Portal",
  description: "Internal messaging platform",
}

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Chat Application</h1>
        <p className="text-muted-foreground">Internal messaging platform</p>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <h2 className="text-lg font-medium">Chat Application</h2>
        <p className="mt-2 text-muted-foreground">This is a placeholder for the chat application</p>
      </div>
    </div>
  )
}

