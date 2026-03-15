"use client"

import { useState, useCallback } from "react"
import type { Provider, ApiKeyStore, VertexConfig } from "@/lib/types"

export function useApiKeys() {
  const [keys, setKeys] = useState<ApiKeyStore>({})
  const [vertexConfig, setVertexConfig] = useState<VertexConfig>({ project: "", location: "" })

  const setKey = useCallback((provider: Provider, key: string) => {
    setKeys((prev) => ({ ...prev, [provider]: key }))
  }, [])

  const clearKey = useCallback((provider: Provider) => {
    setKeys((prev) => {
      const next = { ...prev }
      delete next[provider]
      return next
    })
  }, [])

  const getKey = useCallback((provider: Provider) => keys[provider], [keys])

  const hasKey = useCallback((provider: Provider) => !!keys[provider], [keys])

  const configuredProviders = useCallback(
    () => (Object.keys(keys) as Provider[]).filter((k) => !!keys[k]),
    [keys]
  )

  return {
    keys,
    vertexConfig,
    setVertexConfig,
    setKey,
    clearKey,
    getKey,
    hasKey,
    configuredProviders,
  }
}
