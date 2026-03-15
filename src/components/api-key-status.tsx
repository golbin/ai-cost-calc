"use client"

import { Badge } from "@/components/ui/badge"
import { providerNames } from "@/lib/models"
import type { Provider } from "@/lib/types"

interface ApiKeyStatusProps {
  providers: Provider[]
}

export function ApiKeyStatus({ providers }: ApiKeyStatusProps) {
  if (providers.length === 0) {
    return (
      <span className="text-sm text-muted-foreground">No API keys configured</span>
    )
  }

  return (
    <div className="flex items-center gap-1.5">
      {providers.map((p) => (
        <Badge key={p} variant="secondary" className="text-xs">
          {providerNames[p] ?? p}
        </Badge>
      ))}
    </div>
  )
}
