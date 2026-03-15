"use client"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { models, providerNames } from "@/lib/models"
import type { Provider, ModelDefinition } from "@/lib/types"

interface ModelSelectorProps {
  value: string | undefined
  onSelect: (model: ModelDefinition) => void
  hasKey: (provider: Provider) => boolean
}

export function ModelSelector({ value, onSelect, hasKey }: ModelSelectorProps) {
  const grouped = Object.entries(providerNames).map(([provider, name]) => ({
    provider: provider as Provider,
    name,
    models: models.filter((m) => m.provider === provider),
  }))

  const handleChange = (val: string | null) => {
    if (!val) return
    // val = "provider:modelId"
    const [provider, ...rest] = val.split(":")
    const modelId = rest.join(":")
    const model = models.find((m) => m.id === modelId && m.provider === provider)
    if (model) onSelect(model)
  }

  const selectedValue = value || ""

  return (
    <Select value={selectedValue} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {grouped.map((group) => {
          const enabled = hasKey(group.provider)
          return (
            <SelectGroup key={group.provider}>
              <SelectLabel className="text-xs text-muted-foreground">
                {group.name}
                {!enabled && " (no key)"}
              </SelectLabel>
              {group.models.map((m) =>
                enabled ? (
                  <SelectItem key={`${m.provider}:${m.id}`} value={`${m.provider}:${m.id}`}>
                    {m.name}
                  </SelectItem>
                ) : (
                  <Tooltip key={`${m.provider}:${m.id}`}>
                    <TooltipTrigger>
                      <div className="relative flex w-full cursor-not-allowed select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm text-muted-foreground/50">
                        {m.name}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      Set {group.name} API key in settings
                    </TooltipContent>
                  </Tooltip>
                )
              )}
            </SelectGroup>
          )
        })}
      </SelectContent>
    </Select>
  )
}
