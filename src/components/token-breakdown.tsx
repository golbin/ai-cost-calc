"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { TokenUsage } from "@/lib/types"

interface TokenBreakdownProps {
  usage: TokenUsage
}

export function TokenBreakdown({ usage }: TokenBreakdownProps) {
  const segments: { label: string; value: number; color: string }[] = []

  const { inputTokenDetails, outputTokenDetails } = usage

  // Input segments
  if (inputTokenDetails) {
    if (inputTokenDetails.noCacheTokens) {
      segments.push({ label: "Input", value: inputTokenDetails.noCacheTokens, color: "bg-blue-500" })
    }
    if (inputTokenDetails.cacheReadTokens) {
      segments.push({ label: "Cache Read", value: inputTokenDetails.cacheReadTokens, color: "bg-green-500" })
    }
    if (inputTokenDetails.cacheWriteTokens) {
      segments.push({ label: "Cache Write", value: inputTokenDetails.cacheWriteTokens, color: "bg-yellow-500" })
    }
    // Fallback: details exist but no breakdown values — show total input
    if (!inputTokenDetails.noCacheTokens && !inputTokenDetails.cacheReadTokens && !inputTokenDetails.cacheWriteTokens && usage.inputTokens > 0) {
      segments.push({ label: "Input", value: usage.inputTokens, color: "bg-blue-500" })
    }
  } else {
    segments.push({ label: "Input", value: usage.inputTokens, color: "bg-blue-500" })
  }

  // Output segments
  if (outputTokenDetails) {
    if (outputTokenDetails.reasoningTokens) {
      segments.push({ label: "Reasoning", value: outputTokenDetails.reasoningTokens, color: "bg-orange-500" })
    }
    // Text tokens: explicit value, or compute from total minus reasoning
    const textTokens = outputTokenDetails.textTokens ?? (usage.outputTokens - (outputTokenDetails.reasoningTokens ?? 0))
    if (textTokens > 0) {
      segments.push({ label: "Output", value: textTokens, color: "bg-purple-500" })
    }
  } else {
    segments.push({ label: "Output", value: usage.outputTokens, color: "bg-purple-500" })
  }

  const total = segments.reduce((sum, s) => sum + s.value, 0)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">
          Token Usage
          <span className="ml-2 text-xs font-normal text-muted-foreground">
            {usage.totalTokens.toLocaleString()} total
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Bar visualization */}
        {total > 0 && (
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
            {segments.map((seg, i) =>
              seg.value > 0 ? (
                <div
                  key={i}
                  className={`${seg.color} transition-all`}
                  style={{ width: `${(seg.value / total) * 100}%` }}
                />
              ) : null
            )}
          </div>
        )}

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {segments.map(
            (seg, i) =>
              seg.value > 0 && (
                <div key={i} className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${seg.color}`} />
                  <span className="text-muted-foreground">{seg.label}</span>
                  <span className="ml-auto font-medium">{seg.value.toLocaleString()}</span>
                </div>
              )
          )}
        </div>
      </CardContent>
    </Card>
  )
}
