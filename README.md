# Monument Recognition App

Application de reconnaissance de monuments utilisant CLIP et ONNX Runtime (100% local, pas d'API externe).

## 🚀 Installation

### Prérequis
- Java 21+
- Node.js 18+
- Maven

### Setup des modèles ONNX

⚠️ Les modèles CLIP ne sont pas inclus dans Git (trop volumineux). Téléchargez-les :

```bash
cd backend/src/main/resources

# Vision model (85 MB)
curl -L -o clip_vision.onnx "https://huggingface.co/Xenova/clip-vit-base-patch32/resolve/main/onnx/vision_model.onnx"

# Text model (62 MB)
curl -L -o clip_text.onnx "https://huggingface.co/Xenova/clip-vit-base-patch32/resolve/main/onnx/text_model_quantized.onnx"
```

## 📦 Lancer l'application

### Backend (Quarkus)

```bash
cd backend
.\mvnw.cmd quarkus:dev
```

API disponible sur `http://localhost:8080`

### Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Interface disponible sur `http://localhost:5173`

## 🧪 Test de l'API

```bash
curl -X POST http://localhost:8080/api/image/recognize -F "file=@monument.jpg"
```

Réponse :
```json
{
  "monument": "Tour Eiffel",
  "confidence": 0.95,
  "top5": [
    {"monument": "Tour Eiffel", "confidence": 0.95},
    {"monument": "Arc de Triomphe", "confidence": 0.75}
  ]
}
```

## 🏛️ Monuments reconnus

30 monuments : Tour Eiffel, Arc de Triomphe, Taj Mahal, Colisée, Statue de la Liberté, Big Ben, Pyramides de Gizeh, Notre-Dame de Paris, Sagrada Familia, Burj Khalifa, Christ Rédempteur, Machu Picchu, Grande Muraille de Chine, Opéra de Sydney, Stonehenge, Mont Rushmore, Alhambra, Parthénon, Petra, Angkor Wat, Chichen Itza, Mont Saint-Michel, Neuschwanstein, Cathédrale Saint-Basile, Golden Gate Bridge, Empire State Building, Tower Bridge, Louvre, Brandenburg Gate, Palace of Westminster.
