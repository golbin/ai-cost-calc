import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { generateText } from "ai"
import { findModel } from "@/lib/models"
import { getLanguageModel } from "@/lib/providers"
import { calculateCost, calculateAudioCost } from "@/lib/cost-calculator"
import type { TokenUsage, CalculateResponse, Provider, ModelDefinition } from "@/lib/types"

const requestSchema = z.object({
  modelId: z.string(),
  provider: z.enum(["openai", "anthropic", "google", "google-vertex", "groq"]),
  prompt: z.string().min(1),
  images: z.array(z.string()).optional(),
  audioFiles: z.array(z.string()).optional(),
  audioMediaTypes: z.array(z.string()).optional(),
  apiKey: z.string().min(1, "API key is required"),
  vertexProject: z.string().optional(),
  vertexLocation: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = requestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues.map((e) => e.message).join(", ") },
        { status: 400 }
      )
    }

    const {
      modelId,
      provider,
      prompt,
      images,
      audioFiles,
      audioMediaTypes,
      apiKey,
      vertexProject,
      vertexLocation,
    } = parsed.data

    const model = findModel(modelId, provider)
    if (!model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    const startTime = Date.now()

    // Handle audio-only (transcription) models
    if (model.isAudioOnly) {
      return handleTranscription(model, provider as Provider, apiKey, audioFiles, audioMediaTypes, startTime)
    }

    // Build multimodal message content
    const content: Array<
      | { type: "text"; text: string }
      | { type: "image"; image: string }
      | { type: "file"; data: string; mediaType: string }
    > = []

    content.push({ type: "text", text: prompt })

    if (images?.length) {
      for (const img of images) {
        content.push({ type: "image", image: img })
      }
    }

    if (audioFiles?.length && audioMediaTypes?.length) {
      for (let i = 0; i < audioFiles.length; i++) {
        content.push({
          type: "file",
          data: audioFiles[i],
          mediaType: audioMediaTypes[i] || "audio/wav",
        })
      }
    }

    const vertexConfig =
      provider === "google-vertex" && vertexProject && vertexLocation
        ? { project: vertexProject, location: vertexLocation }
        : undefined

    const languageModel = getLanguageModel(provider as Provider, modelId, apiKey, vertexConfig)

    const result = await generateText({
      model: languageModel,
      messages: [{ role: "user", content }],
      maxOutputTokens: 16_384,
    })

    const latencyMs = Date.now() - startTime

    // Extract usage from AI SDK response — the SDK provides inputTokens/outputTokens/totalTokens directly
    const rawUsage = result.usage
    const usage: TokenUsage = {
      inputTokens: rawUsage.inputTokens ?? 0,
      outputTokens: rawUsage.outputTokens ?? 0,
      totalTokens: rawUsage.totalTokens ?? 0,
      inputTokenDetails: rawUsage.inputTokenDetails ? {
        noCacheTokens: rawUsage.inputTokenDetails.noCacheTokens ?? undefined,
        cacheReadTokens: rawUsage.inputTokenDetails.cacheReadTokens ?? undefined,
        cacheWriteTokens: rawUsage.inputTokenDetails.cacheWriteTokens ?? undefined,
      } : undefined,
      outputTokenDetails: rawUsage.outputTokenDetails ? {
        textTokens: rawUsage.outputTokenDetails.textTokens ?? undefined,
        reasoningTokens: rawUsage.outputTokenDetails.reasoningTokens ?? undefined,
      } : undefined,
    }

    const costs = calculateCost(usage, model.pricing)

    const response: CalculateResponse = {
      usage,
      costs,
      model,
      responseText: result.text ?? "",
      latencyMs,
    }

    return NextResponse.json(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

async function handleTranscription(
  model: ModelDefinition,
  provider: Provider,
  apiKey: string,
  audioFiles?: string[],
  audioMediaTypes?: string[],
  startTime = Date.now()
) {
  if (!audioFiles?.length) {
    return NextResponse.json({ error: "Audio file is required for transcription models" }, { status: 400 })
  }

  const audioData = audioFiles[0]
  const mimeType = audioMediaTypes?.[0] || "audio/wav"

  const transcriptionEndpoints: Record<string, string> = {
    groq: "https://api.groq.com/openai/v1/audio/transcriptions",
    openai: "https://api.openai.com/v1/audio/transcriptions",
  }

  const endpoint = transcriptionEndpoints[provider]
  if (!endpoint) {
    return NextResponse.json({ error: `Transcription not supported for provider: ${provider}` }, { status: 400 })
  }

  let responseText = ""
  let durationSeconds = 0

  try {
    const audioBuffer = Buffer.from(audioData, "base64")
    const blob = new Blob([audioBuffer], { type: mimeType })
    const formData = new FormData()
    formData.append("file", blob, `audio.${getExtension(mimeType)}`)
    formData.append("model", model.id)

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: formData,
    })

    if (!res.ok) {
      const errBody = await res.text()
      throw new Error(`${provider} API error: ${res.status} ${errBody}`)
    }

    const data = await res.json()
    responseText = data.text ?? ""
    durationSeconds = data.duration ?? estimateDuration(audioBuffer.length, mimeType)
  } catch (error) {
    const message = error instanceof Error ? error.message : "Transcription failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }

  const latencyMs = Date.now() - startTime
  const audioCost = calculateAudioCost(durationSeconds, model.pricing)

  const response: CalculateResponse = {
    usage: {
      inputTokens: 0,
      outputTokens: 0,
      totalTokens: 0,
    },
    costs: {
      inputCost: 0,
      outputCost: 0,
      cachedInputCost: 0,
      cacheWriteCost: 0,
      reasoningCost: 0,
      totalCost: audioCost,
    },
    model,
    responseText,
    latencyMs,
  }

  return NextResponse.json(response)
}

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    "audio/wav": "wav",
    "audio/mpeg": "mp3",
    "audio/mp3": "mp3",
    "audio/ogg": "ogg",
    "audio/flac": "flac",
    "audio/m4a": "m4a",
    "audio/webm": "webm",
    "audio/mp4": "m4a",
  }
  return map[mimeType] || "wav"
}

function estimateDuration(byteLength: number, mimeType: string): number {
  // Rough estimate: assume ~16kbps for compressed, ~256kbps for wav
  const isWav = mimeType.includes("wav")
  const bitrate = isWav ? 256_000 : 16_000
  return (byteLength * 8) / bitrate
}

