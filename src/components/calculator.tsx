"use client"

import { useState, useCallback } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "./header"
import { ApiKeySettings } from "./api-key-settings"
import { ModelSelector } from "./model-selector"
import { PromptInput } from "./prompt-input"
import { FileUpload } from "./file-upload"
import { ResultPanel } from "./result-panel"
import { useApiKeys } from "@/hooks/use-api-keys"
import type { ModelDefinition, CalculateResponse, Provider } from "@/lib/types"

interface AudioFile {
  data: string
  name: string
  mediaType: string
  size: number
}

export function Calculator() {
  const {
    keys,
    vertexConfig,
    setVertexConfig,
    setKey,
    clearKey,
    getKey,
    hasKey,
    configuredProviders,
  } = useApiKeys()

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [selectedModel, setSelectedModel] = useState<ModelDefinition | null>(null)
  const [prompt, setPrompt] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([])
  const [result, setResult] = useState<CalculateResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleModelSelect = useCallback(
    (model: ModelDefinition) => {
      setSelectedModel(model)
      // Remove unsupported files
      if (!model.capabilities.supportsImages) setImages([])
      if (!model.capabilities.supportsAudio) setAudioFiles([])
    },
    []
  )

  const handleCalculate = async () => {
    if (!selectedModel) return

    const apiKey = getKey(selectedModel.provider)
    if (!apiKey) {
      setError(`No API key configured for ${selectedModel.provider}. Open settings to add one.`)
      return
    }

    if (!selectedModel.isAudioOnly && !prompt.trim()) {
      setError("Please enter a prompt.")
      return
    }

    if (selectedModel.isAudioOnly && audioFiles.length === 0) {
      setError("Please attach an audio file for transcription models.")
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const body: Record<string, unknown> = {
        modelId: selectedModel.id,
        provider: selectedModel.provider,
        prompt: prompt || "Transcribe this audio.",
        apiKey,
      }

      if (images.length > 0) body.images = images
      if (audioFiles.length > 0) {
        body.audioFiles = audioFiles.map((f) => f.data)
        body.audioMediaTypes = audioFiles.map((f) => f.mediaType)
      }
      if (selectedModel.provider === "google-vertex") {
        body.vertexProject = vertexConfig.project
        body.vertexLocation = vertexConfig.location
      }

      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || `Request failed with status ${res.status}`)
      } else {
        setResult(data as CalculateResponse)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed")
    } finally {
      setLoading(false)
    }
  }

  const modelKey = selectedModel
    ? `${selectedModel.provider}:${selectedModel.id}`
    : undefined

  const canCalculate =
    selectedModel &&
    hasKey(selectedModel.provider) &&
    (selectedModel.isAudioOnly ? audioFiles.length > 0 : prompt.trim().length > 0) &&
    !loading

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        configuredProviders={configuredProviders()}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <ApiKeySettings
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        keys={keys}
        vertexConfig={vertexConfig}
        onSetKey={setKey}
        onClearKey={clearKey}
        onSetVertexConfig={setVertexConfig}
      />

      <main className="container mx-auto flex-1 px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Panel: Input */}
          <div className="space-y-4">
            <ModelSelector
              value={modelKey}
              onSelect={handleModelSelect}
              hasKey={hasKey as (provider: Provider) => boolean}
            />

            {!selectedModel?.isAudioOnly && (
              <PromptInput
                value={prompt}
                onChange={setPrompt}
                disabled={loading}
              />
            )}

            {selectedModel && (
              <FileUpload
                supportsImages={selectedModel.capabilities.supportsImages}
                supportsAudio={selectedModel.capabilities.supportsAudio}
                isAudioOnly={selectedModel.isAudioOnly}
                images={images}
                audioFiles={audioFiles}
                onAddImage={(b64) => setImages((prev) => [...prev, b64])}
                onRemoveImage={(i) =>
                  setImages((prev) => prev.filter((_, idx) => idx !== i))
                }
                onAddAudio={(file) => setAudioFiles((prev) => [...prev, file])}
                onRemoveAudio={(i) =>
                  setAudioFiles((prev) => prev.filter((_, idx) => idx !== i))
                }
              />
            )}

            <Button
              className="w-full"
              size="lg"
              disabled={!canCalculate}
              onClick={handleCalculate}
            >
              {loading ? (
                "Calculating..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Calculate Cost
                </>
              )}
            </Button>
          </div>

          {/* Right Panel: Results */}
          <div>
            <ResultPanel
              result={result}
              error={error}
              loading={loading}
              hasAnyKey={configuredProviders().length > 0}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
