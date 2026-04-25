import { Outlet } from "react-router-dom"

export function AppLayout() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col bg-surface">
      <header className="border-b border-border px-6 py-4">
        <p className="text-sm text-muted">Ether App</p>
        <h1 className="text-xl font-semibold text-foreground">My Child</h1>
      </header>
      <main className="flex-1 px-6 py-6">
        <Outlet />
      </main>
    </div>
  )
}
