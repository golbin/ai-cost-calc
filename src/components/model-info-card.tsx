"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ModelDefinition } from "@/lib/types"

interface ModelInfoCardProps {
  model: ModelDefinition
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

function formatPrice(n: number): string {
  if (n === 0) return "—"
  if (n < 0.01) return `$${n.toFixed(4)}`
  return `$${n.toFixed(2)}`
}

export function ModelInfoCard({ model }: ModelInfoCardProps) {
  const { pricing, capabilities } = model

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{model.name}</CardTitle>
        <div className="flex flex-wrap gap-1">
          {capabilities.supportsImages && <Badge variant="outline" className="text-xs">Image</Badge>}
          {capabilities.supportsAudio && <Badge variant="outline" className="text-xs">Audio</Badge>}
          {capabilities.supportsReasoning && <Badge variant="outline" className="text-xs">Reasoning</Badge>}
          {capabilities.supportsCaching && <Badge variant="outline" className="text-xs">Caching</Badge>}
          {model.isAudioOnly && <Badge variant="secondary" className="text-xs">Transcription Only</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        {!model.isAudioOnly && (
          <>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Context</span>
              <span>{formatNumber(model.contextWindow)} tokens</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max Output</span>
              <span>{formatNumber(model.maxOutput)} tokens</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Input</span>
              <span>{formatPrice(pricing.inputPerMillion)} / 1M tokens</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Output</span>
              <span>{formatPrice(pricing.outputPerMillion)} / 1M tokens</span>
            </div>
            {pricing.cachedInputPerMillion !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cached Input</span>
                <span>{formatPrice(pricing.cachedInputPerMillion)} / 1M tokens</span>
              </div>
            )}
            {pricing.cacheWritePerMillion !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cache Write</span>
                <span>{formatPrice(pricing.cacheWritePerMillion)} / 1M tokens</span>
              </div>
            )}
          </>
        )}
        {pricing.audioInputPerHour !== undefined && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Audio</span>
            <span>{formatPrice(pricing.audioInputPerHour)} / hour</span>
          </div>
        )}
        {pricing.audioInputPerMinute !== undefined && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Audio</span>
            <span>{formatPrice(pricing.audioInputPerMinute)} / min</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
