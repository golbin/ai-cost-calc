import { TokenUsage, CostBreakdown, ModelPricing } from "./types"

export function calculateCost(usage: TokenUsage, pricing: ModelPricing): CostBreakdown {
  const { inputTokenDetails, outputTokenDetails } = usage

  // Input cost: use noCacheTokens if available, otherwise full inputTokens
  const inputTokenCount = inputTokenDetails?.noCacheTokens ?? usage.inputTokens
  const inputCost = (inputTokenCount / 1_000_000) * pricing.inputPerMillion

  // Cached input cost
  const cacheReadTokens = inputTokenDetails?.cacheReadTokens ?? 0
  const cachedInputCost = (cacheReadTokens / 1_000_000) * (pricing.cachedInputPerMillion ?? 0)

  // Cache write cost
  const cacheWriteTokens = inputTokenDetails?.cacheWriteTokens ?? 0
  const cacheWriteCost = (cacheWriteTokens / 1_000_000) * (pricing.cacheWritePerMillion ?? 0)

  // Output cost & reasoning cost
  const reasoningTokens = outputTokenDetails?.reasoningTokens ?? 0
  const reasoningRate = pricing.reasoningOutputPerMillion ?? pricing.outputPerMillion
  const reasoningCost = (reasoningTokens / 1_000_000) * reasoningRate

  // Text output tokens: if details exist, use textTokens; otherwise subtract reasoning from total
  const textTokenCount = outputTokenDetails
    ? (outputTokenDetails.textTokens ?? (usage.outputTokens - reasoningTokens))
    : usage.outputTokens
  const outputCost = (Math.max(0, textTokenCount) / 1_000_000) * pricing.outputPerMillion

  const totalCost = inputCost + outputCost + cachedInputCost + cacheWriteCost + reasoningCost

  return {
    inputCost,
    outputCost,
    cachedInputCost,
    cacheWriteCost,
    reasoningCost,
    totalCost,
  }
}

export function calculateAudioCost(
  durationSeconds: number,
  pricing: ModelPricing
): number {
  if (pricing.audioInputPerHour !== undefined) {
    return (durationSeconds / 3600) * pricing.audioInputPerHour
  }
  if (pricing.audioInputPerMinute !== undefined) {
    return (durationSeconds / 60) * pricing.audioInputPerMinute
  }
  return 0
}
