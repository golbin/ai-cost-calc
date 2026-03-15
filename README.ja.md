# AI Cost Calculator

[English](README.md) | [한국어](README.ko.md)

https://ai-cost-calc-eta.vercel.app

実際のAI API呼び出しを行い、トークン使用量とコストを測定するWebツール。

プロンプト（+画像/音声）を入力してモデルを選択すると、APIを呼び出してトークン数とコストの内訳を表示する。

## 対応プロバイダー

- **OpenAI** - GPT-4o、GPT-4.1、GPT-5シリーズ、Transcribeモデル
- **Anthropic** - Claude Opus 4.6、Claude Sonnet 4.6
- **Google Gemini** - Gemini 2.5/3/3.1（AI Studio & Vertex AI）
- **Groq** - Whisper V3（音声文字起こし）

## 主な機能

- トークン詳細分類（input / output / cache read / cache write / reasoning）
- 項目別コスト計算
- マルチモーダル入力（テキスト、画像、音声）
- 音声文字起こしモデル対応（Whisper、GPT Transcribe）

## APIキー管理

APIキーはブラウザメモリにのみ保存される。サーバーには保存されず、ページ更新時に消去される。

## 起動

```bash
pnpm install
pnpm dev
```

http://localhost:3000 で設定ボタンからAPIキーを入力して使用する。

## 技術スタック

Next.js (App Router) + shadcn/ui + Vercel AI SDK + TypeScript
