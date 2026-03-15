"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Check, X } from "lucide-react"
import type { Provider, ApiKeyStore, VertexConfig } from "@/lib/types"

interface ApiKeySettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  keys: ApiKeyStore
  vertexConfig: VertexConfig
  onSetKey: (provider: Provider, key: string) => void
  onClearKey: (provider: Provider) => void
  onSetVertexConfig: (config: VertexConfig) => void
}

const providers: { id: Provider; label: string; placeholder: string }[] = [
  { id: "openai", label: "OpenAI", placeholder: "sk-..." },
  { id: "anthropic", label: "Anthropic", placeholder: "sk-ant-..." },
  { id: "google", label: "Google AI Studio", placeholder: "AIza..." },
  { id: "groq", label: "Groq", placeholder: "gsk_..." },
]

export function ApiKeySettings({
  open,
  onOpenChange,
  keys,
  vertexConfig,
  onSetKey,
  onClearKey,
  onSetVertexConfig,
}: ApiKeySettingsProps) {
  const [drafts, setDrafts] = useState<ApiKeyStore>({})
  const [draftVertex, setDraftVertex] = useState<VertexConfig>({ project: "", location: "" })

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setDrafts({ ...keys })
      setDraftVertex({ ...vertexConfig })
    }
    onOpenChange(isOpen)
  }

  const handleSave = () => {
    for (const p of providers) {
      const val = drafts[p.id]
      if (val && val.trim()) {
        onSetKey(p.id, val.trim())
      } else {
        onClearKey(p.id)
      }
    }
    // Vertex
    const vertexKey = drafts["google-vertex"]
    if (vertexKey && vertexKey.trim()) {
      onSetKey("google-vertex", vertexKey.trim())
    } else {
      onClearKey("google-vertex")
    }
    onSetVertexConfig(draftVertex)
    onOpenChange(false)
  }

  const StatusIcon = ({ provider }: { provider: Provider }) => {
    const hasKey = !!(drafts[provider]?.trim())
    return hasKey ? (
      <Check className="h-4 w-4 text-green-500" />
    ) : (
      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>API Key Settings</DialogTitle>
          <DialogDescription>
            Keys are stored in memory only. They will be cleared on page refresh.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {providers.map((p) => (
            <div key={p.id} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <StatusIcon provider={p.id} />
                <Label className="text-sm font-medium">{p.label}</Label>
              </div>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder={p.placeholder}
                  value={drafts[p.id] ?? ""}
                  onChange={(e) =>
                    setDrafts((prev) => ({ ...prev, [p.id]: e.target.value }))
                  }
                  className="font-mono text-xs"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                  onClick={() => {
                    setDrafts((prev) => ({ ...prev, [p.id]: "" }))
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <Separator />

          {/* Google Vertex AI */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <StatusIcon provider="google-vertex" />
              <Label className="text-sm font-medium">Google Vertex AI</Label>
            </div>
            <textarea
              placeholder="API Key (express mode) or Service Account JSON"
              value={drafts["google-vertex"] ?? ""}
              onChange={(e) =>
                setDrafts((prev) => ({ ...prev, "google-vertex": e.target.value }))
              }
              className="flex w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-xs font-mono transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 min-h-[60px] max-h-[120px] resize-y"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Project</Label>
                <Input
                  placeholder="my-project"
                  value={draftVertex.project}
                  onChange={(e) =>
                    setDraftVertex((prev) => ({ ...prev, project: e.target.value }))
                  }
                  className="text-xs"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Location</Label>
                <Input
                  placeholder="us-central1"
                  value={draftVertex.location}
                  onChange={(e) =>
                    setDraftVertex((prev) => ({ ...prev, location: e.target.value }))
                  }
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save & Close
        </Button>
      </DialogContent>
    </Dialog>
  )
}
