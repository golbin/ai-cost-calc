"use client"

import { KeyRound, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ModelInfoCard } from "./model-info-card"
import { TokenBreakdown } from "./token-breakdown"
import { CostBreakdown } from "./cost-breakdown"
import { ErrorDisplay } from "./error-display"
import type { CalculateResponse } from "@/lib/types"

interface ResultPanelProps {
  result: CalculateResponse | null
  error: string | null
  loading: boolean
  hasAnyKey: boolean
}

export function ResultPanel({ result, error, loading, hasAnyKey }: ResultPanelProps) {

  if (!hasAnyKey) {
    return (
      <Card className="flex h-full min-h-[300px] items-center justify-center">
        <CardContent className="flex flex-col items-center gap-3 text-center">
          <KeyRound className="h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">
            Configure API keys in settings to get started.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card className="flex h-full min-h-[300px] items-center justify-center">
        <CardContent className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Calling API...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return <ErrorDisplay message={error} />
  }

  if (!result) {
    return (
      <Card className="flex h-full min-h-[300px] items-center justify-center">
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Select a model and enter a prompt, then click &quot;Calculate Cost&quot;.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <ModelInfoCard model={result.model} />
      <TokenBreakdown usage={result.usage} />
      <CostBreakdown costs={result.costs} latencyMs={result.latencyMs} />

      {/* Response output */}
      {result.responseText && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Response</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[500px] overflow-y-auto rounded-md bg-muted p-3 text-sm whitespace-pre-wrap">
              {result.responseText}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
