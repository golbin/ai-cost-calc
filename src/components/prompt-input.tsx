"use client"

import { useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function PromptInput({ value, onChange, disabled }: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.height = `${Math.min(el.scrollHeight, 300)}px`
    }
  }, [value])

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor="prompt" className="text-sm font-medium">Prompt</Label>
        <span className="text-xs text-muted-foreground">{value.length} chars</span>
      </div>
      <Textarea
        id="prompt"
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your prompt here..."
        className="min-h-[100px] resize-none"
        disabled={disabled}
      />
    </div>
  )
}
