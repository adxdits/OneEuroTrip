# StreetCLIP — Local Monument Recognition

This repository runs a **100% local** StreetCLIP/CLIP model to recognize landmarks. No external APIs are used for recognition.

## Architecture

- **Python Service (Flask)**: Runs StreetCLIP locally on your machine (port 5000)
- **Quarkus Backend**: Forwards image requests to the local Python service (port 8080)
- **Frontend (React)**: Optional UI to upload images (port 5173)

Everything runs locally — no cloud APIs, no external recognition services.

## Download the Model

Get the StreetCLIP model from Hugging Face:
- **URL**: https://huggingface.co/geolocal/StreetCLIP
- Download the PyTorch weights file and place it at:

```
backend/src/main/python/pytorch_model.bin
```

## Quick Start (Windows PowerShell)

### 1. Python Service

```powershell
cd C:\Users\adama\Desktop\al_mounayar-hamani\backend\src\main\python
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
pip install git+https://github.com/openai/CLIP.git
python monument_recognition.py
```

### 2. Backend (Quarkus)

```powershell
cd C:\Users\adama\Desktop\al_mounayar-hamani\backend
.\mvnw.cmd quarkus:dev
```

The backend will be available at http://localhost:8080

## API Endpoints

- `GET /api/monuments/health` - Check if Python service is running
- `POST /api/monuments/recognize` - Upload image (multipart/form-data)
- `POST /api/monuments/recognize/base64` - Send base64 image (JSON)

Example response:
```json
{
  "monument": "Tour Eiffel, Paris",
  "confidence": 0.95
}
```

## Important Notes

- ✅ **Everything runs locally** - no external recognition APIs
- ✅ The Python service uses your local StreetCLIP model
- ✅ Model weights are NOT committed to Git (large file, .gitignore excludes them)
- ⚠️ If you see "No module named clip", run `pip install git+https://github.com/openai/CLIP.git`

---

That's it! You now have a fully local monument recognition system running on your machine.
