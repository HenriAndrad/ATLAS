# Vision Translator AI — Web

Aplicação web que traduz em tempo real objetos e textos vistos pela câmera do navegador.

Stack: React + TypeScript (frontend) · Python + FastAPI (backend).

## Rodando localmente

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Acesse `http://localhost:8000/docs` para ver a documentação interativa (Swagger).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Deploy

- Backend: Render (Blueprint em `render.yaml`)
- Frontend: GitHub Pages (workflow em `.github/workflows/deploy-pages.yml`)

## Status atual

- Etapa 1: setup do projeto (frontend + backend rodando e se comunicando). ✅
- Etapa 2: câmera via getUserMedia no navegador. ✅
- Etapa 3: detecção de objetos em tempo real (TensorFlow.js / COCO-SSD). ✅
- Etapa 4: tradução do nome detectado via backend (DeepL). ✅
- Deploy: backend no Render (Python/FastAPI) ✅, frontend no GitHub Pages (em andamento)
- Próximas etapas: seletor de idioma, OCR, áudio (TTS).
