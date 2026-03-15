"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ApiKeyStatus } from "./api-key-status"
import type { Provider } from "@/lib/types"

interface HeaderProps {
  configuredProviders: Provider[]
  onOpenSettings: () => void
}

export function Header({ configuredProviders, onOpenSettings }: HeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">AI Cost Calculator</h1>
        </div>
        <div className="flex items-center gap-3">
          <ApiKeyStatus providers={configuredProviders} />
          <Button variant="outline" size="icon" onClick={onOpenSettings}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
