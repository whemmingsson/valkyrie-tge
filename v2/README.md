# Valkyrie TGE

This project creates local text embeddings with Ollama and `embeddinggemma-2`.

## Setup

1. Install Ollama for Windows from [ollama.com/download](https://ollama.com/download).
2. Open a new PowerShell window and download the model:

   ```powershell
   ollama pull embeddinggemma-2
   ```

3. Generate an embedding:

   ```powershell
   pnpm embed
   ```

Ollama serves its API locally at `http://127.0.0.1:11434` by default. Override the endpoint with `OLLAMA_URL` or select a different installed model with `OLLAMA_MODEL`.

```powershell
$env:OLLAMA_MODEL = "embeddinggemma-2:270m"
pnpm embed
```

## Debug Logging

Set `DEBUG` to enable debug logging. Use `DEBUG_OUTPUT` to route logs to the
game console, a new session file in `logs`, or both. Session files are named
with the date and time they are created.

```powershell
$env:DEBUG = "1"
$env:DEBUG_OUTPUT = "both" # console, file, or both
pnpm dev
```
