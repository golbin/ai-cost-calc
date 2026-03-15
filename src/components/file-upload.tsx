"use client"

import { useCallback, useRef } from "react"
import { ImageIcon, Music, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface FileUploadProps {
  supportsImages: boolean
  supportsAudio: boolean
  isAudioOnly?: boolean
  images: string[]
  audioFiles: { data: string; name: string; mediaType: string; size: number }[]
  onAddImage: (base64: string) => void
  onRemoveImage: (index: number) => void
  onAddAudio: (file: { data: string; name: string; mediaType: string; size: number }) => void
  onRemoveAudio: (index: number) => void
}

export function FileUpload({
  supportsImages,
  supportsAudio,
  isAudioOnly,
  images,
  audioFiles,
  onAddImage,
  onRemoveImage,
  onAddAudio,
  onRemoveAudio,
}: FileUploadProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  const handleImageDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      )
      files.forEach((file) => readFileAsBase64(file, onAddImage))
    },
    [onAddImage]
  )

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      files.forEach((file) => readFileAsBase64(file, onAddImage))
      e.target.value = ""
    },
    [onAddImage]
  )

  const handleAudioSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      files.forEach((file) => {
        readFileAsBase64(file, (base64) => {
          onAddAudio({
            data: base64,
            name: file.name,
            mediaType: file.type || "audio/wav",
            size: file.size,
          })
        })
      })
      e.target.value = ""
    },
    [onAddAudio]
  )

  if (!supportsImages && !supportsAudio) return null

  return (
    <div className="space-y-3">
      {/* Image upload */}
      {supportsImages && !isAudioOnly && (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Images</Label>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleImageDrop}
            onClick={() => imageInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed p-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-muted/50"
          >
            <ImageIcon className="h-5 w-5" />
            <span>Drop images here or click to browse</span>
          </div>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageSelect}
          />
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {images.map((img, i) => (
                <div key={i} className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`data:image/png;base64,${img}`}
                    alt={`Upload ${i + 1}`}
                    className="h-16 w-16 rounded-md border object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveImage(i)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Audio upload */}
      {supportsAudio && (
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Audio</Label>
          <div
            onClick={() => audioInputRef.current?.click()}
            className="flex cursor-pointer flex-col items-center gap-2 rounded-md border border-dashed p-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-muted/50"
          >
            <Music className="h-5 w-5" />
            <span>Click to attach audio file</span>
            <span className="text-xs">MP3, WAV, OGG, FLAC, M4A, WEBM</span>
          </div>
          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*,.mp3,.wav,.ogg,.flac,.m4a,.webm"
            className="hidden"
            onChange={handleAudioSelect}
          />
          {audioFiles.length > 0 && (
            <div className="space-y-1 pt-1">
              {audioFiles.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate max-w-[200px]">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(file.size / 1024).toFixed(0)} KB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => onRemoveAudio(i)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function readFileAsBase64(file: File, callback: (base64: string) => void) {
  const reader = new FileReader()
  reader.onload = () => {
    const base64 = (reader.result as string).split(",")[1]
    callback(base64)
  }
  reader.readAsDataURL(file)
}
