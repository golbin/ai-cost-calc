# AI Cost Calculator

[한국어](README.ko.md) | [日本語](README.ja.md)

https://ai-cost-calc-eta.vercel.app

A web tool that measures real token usage and costs by making actual AI API calls.

Enter a prompt (+ images/audio), select a model, and it calls the API to show a detailed breakdown of token counts and costs.

## Supported Providers

- **OpenAI** - GPT-4o, GPT-4.1, GPT-5 series, Transcribe models
- **Anthropic** - Claude Opus 4.6, Claude Sonnet 4.6
- **Google Gemini** - Gemini 2.5/3/3.1 (AI Studio & Vertex AI)
- **Groq** - Whisper V3 (audio transcription)

## Features

- Detailed token breakdown (input / output / cache read / cache write / reasoning)
- Per-category cost calculation
- Multimodal input (text, images, audio)
- Audio transcription models (Whisper, GPT Transcribe)

## API Key Management

API keys are stored in browser memory only. They are never saved on the server and are cleared on page refresh.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000, click the settings button to enter your API keys, and start calculating.

## Tech Stack

Next.js (App Router) + shadcn/ui + Vercel AI SDK + TypeScript
