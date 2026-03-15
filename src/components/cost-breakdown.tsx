"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { CostBreakdown as CostBreakdownType } from "@/lib/types"

interface CostBreakdownProps {
  costs: CostBreakdownType
  latencyMs: number
}

function formatCost(n: number): string {
  if (n === 0) return "$0.000000"
  if (n < 0.000001) return `$${n.toExponential(2)}`
  return `$${n.toFixed(6)}`
}

export function CostBreakdown({ costs, latencyMs }: CostBreakdownProps) {
  const rows = [
    { label: "Input", cost: costs.inputCost },
    { label: "Output", cost: costs.outputCost },
    { label: "Cached Input", cost: costs.cachedInputCost },
    { label: "Cache Write", cost: costs.cacheWriteCost },
    { label: "Reasoning", cost: costs.reasoningCost },
  ].filter((r) => r.cost > 0)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Cost Breakdown</CardTitle>
          <span className="text-xs text-muted-foreground">{latencyMs}ms</span>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Category</TableHead>
              <TableHead className="text-right text-xs">Cost</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="text-xs">{row.label}</TableCell>
                <TableCell className="text-right font-mono text-xs">
                  {formatCost(row.cost)}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-xs text-muted-foreground">
                  No token-based costs (audio pricing applies)
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="text-xs font-semibold">Total</TableCell>
              <TableCell className="text-right font-mono text-xs font-semibold">
                {formatCost(costs.totalCost)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}
