import { createOpenAI } from "@ai-sdk/openai"
import { createAnthropic } from "@ai-sdk/anthropic"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { createVertex } from "@ai-sdk/google-vertex"
import { createGroq } from "@ai-sdk/groq"
import type { Provider } from "./types"

export function getLanguageModel(
  provider: Provider,
  modelId: string,
  apiKey: string,
  vertexConfig?: { project: string; location: string }
) {
  switch (provider) {
    case "openai":
      return createOpenAI({ apiKey })(modelId)
    case "anthropic":
      return createAnthropic({ apiKey })(modelId)
    case "google":
      return createGoogleGenerativeAI({ apiKey })(modelId)
    case "google-vertex": {
      if (!vertexConfig) throw new Error("Vertex AI requires project and location")
      // Detect if the key is a service account JSON or an API key (express mode)
      let serviceAccountCredentials: Record<string, unknown> | null = null
      try {
        const parsed = JSON.parse(apiKey)
        if (parsed.type === "service_account" && parsed.private_key) {
          serviceAccountCredentials = parsed
        }
      } catch {
        // Not JSON — treat as API key for express mode
      }
      if (serviceAccountCredentials) {
        return createVertex({
          project: vertexConfig.project,
          location: vertexConfig.location,
          googleAuthOptions: { credentials: serviceAccountCredentials },
        })(modelId)
      }
      // Express mode with API key
      return createVertex({
        project: vertexConfig.project,
        location: vertexConfig.location,
        apiKey,
      })(modelId)
    }
    case "groq":
      return createGroq({ apiKey })(modelId)
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
}
