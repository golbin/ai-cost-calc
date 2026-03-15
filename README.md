# AI Cost Calculator

AI API 호출의 실제 토큰 사용량과 비용을 측정하는 웹 도구.

프롬프트(+ 이미지/오디오)를 입력하고 모델을 선택하면, 실제 API를 호출한 뒤 토큰 수와 비용을 항목별로 보여준다.

## 지원 프로바이더 및 모델

- **OpenAI** - GPT-4o, GPT-4.1, GPT-5 계열, Transcribe 모델
- **Anthropic** - Claude Opus 4.6, Claude Sonnet 4.6
- **Google Gemini** - Gemini 2.5/3/3.1 (AI Studio & Vertex AI)
- **Groq** - Whisper V3 (음성 전사)

## 주요 기능

- 토큰 상세 분류 (input / output / cache read / cache write / reasoning)
- 항목별 비용 계산
- 멀티모달 입력 (텍스트, 이미지, 오디오)
- 음성 전사 모델 지원 (Whisper, GPT Transcribe)

## API 키 관리

API 키는 브라우저 메모리에만 저장된다. 서버에 저장하지 않으며, 페이지 새로고침 시 사라진다.

## 실행

```bash
pnpm install
pnpm dev
```

http://localhost:3000 에서 설정 버튼을 눌러 API 키를 입력한 뒤 사용한다.

## 기술 스택

Next.js (App Router) + shadcn/ui + Vercel AI SDK + TypeScript
