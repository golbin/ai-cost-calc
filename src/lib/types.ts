export type Provider = "openai" | "anthropic" | "google" | "google-vertex" | "groq"

export interface ApiKeyStore {
  openai?: string
  anthropic?: string
  google?: string
  "google-vertex"?: string
  groq?: string
}

export interface VertexConfig {
  project: string
  location: string
}

export interface ModelPricing {
  inputPerMillion: number
  outputPerMillion: number
  cachedInputPerMillion?: number
  cacheWritePerMillion?: number
  reasoningOutputPerMillion?: number
  audioInputPerMillion?: number
  audioInputPerHour?: number
  audioInputPerMinute?: number
}

export interface ModelCapabilities {
  supportsImages: boolean
  supportsAudio: boolean
  supportsReasoning: boolean
  supportsCaching: boolean
}

export interface ModelDefinition {
  id: string
  name: string
  provider: Provider
  pricing: ModelPricing
  capabilities: ModelCapabilities
  contextWindow: number
  maxOutput: number
  isAudioOnly?: boolean
}

export interface TokenUsage {
  inputTokens: number
  outputTokens: number
  totalTokens: number
  inputTokenDetails?: {
    noCacheTokens?: number
    cacheReadTokens?: number
    cacheWriteTokens?: number
  }
  outputTokenDetails?: {
    textTokens?: number
    reasoningTokens?: number
  }
}

export interface CostBreakdown {
  inputCost: number
  outputCost: number
  cachedInputCost: number
  cacheWriteCost: number
  reasoningCost: number
  totalCost: number
}

export interface CalculateResponse {
  usage: TokenUsage
  costs: CostBreakdown
  model: ModelDefinition
  responseText: string
  latencyMs: number
}
