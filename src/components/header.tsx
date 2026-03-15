"use client"

import { Github, Settings } from "lucide-react"
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
          <a
            href="https://github.com/golbin/ai-cost-calc"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Github className="h-4 w-4" />
          </a>
          <Button variant="outline" size="icon" onClick={onOpenSettings}>
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
