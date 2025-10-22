# 🎨 Guide Visuel - Reconnaissance de Monuments

## 🔄 Flux de Données

```
┌─────────────────────────────────────────────────────────────────┐
│                         UTILISATEUR                              │
│                    Upload une image 📸                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                              │
│  • useMonumentRecognition()                                     │
│  • Envoie FormData avec l'image                                 │
│  • URL: http://localhost:5173                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │ POST /api/monuments/recognize
                             │ multipart/form-data
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND QUARKUS (Java 21)                          │
│  • MonumentRecognitionResource                                  │
│  • Reçoit l'image                                               │
│  • URL: http://localhost:8080                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              MonumentRecognitionService                          │
│  • Encode l'image en base64                                     │
│  • Envoie HTTP POST au service Python                           │
└────────────────────────────┬────────────────────────────────────┘
                             │ POST /recognize
                             │ {"image": "base64..."}
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│             SERVICE PYTHON (Flask)                               │
│  • monument_recognition.py                                      │
│  • URL: http://localhost:5000                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STREETCLIP (PyTorch)                          │
│  • Charge le modèle pytorch_model.bin                           │
│  • Encode l'image avec CLIP                                     │
│  • Compare avec la liste de monuments                           │
│  • Calcule les similarités                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         RÉSULTAT                                 │
│  {                                                               │
│    "monument": "Tour Eiffel, Paris",                            │
│    "confidence": 0.95                                           │
│  }                                                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 AFFICHAGE FRONTEND                               │
│  ┌──────────────────────────────────────────────┐              │
│  │  🏛️ Monument Identifié                       │              │
│  │                                               │              │
│  │  Tour Eiffel                                 │              │
│  │  📍 Paris                                     │              │
│  │                                               │              │
│  │  ✅ Haute confiance  |  Précision: 95.0%    │              │
│  └──────────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

## 📂 Structure des Fichiers Clés

```
al_mounayar-hamani/
│
├── 📄 README.md                          ← Commencez ici !
├── 📄 QUICKSTART.md                      ← Guide rapide
├── 📄 MONUMENT_RECOGNITION.md            ← Doc complète
├── 📄 IMPLEMENTATION_SUMMARY.md          ← Ce qui a été fait
│
├── backend/
│   ├── 📄 README.md
│   ├── 📄 pom.xml                        ← Dépendances Maven
│   │
│   ├── src/main/
│   │   ├── java/com/myapp/
│   │   │   ├── services/
│   │   │   │   ├── 🔧 LLMService.java
│   │   │   │   └── ⭐ MonumentRecognitionService.java  ← Service principal
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── 🌐 ChatResource.java
│   │   │       └── ⭐ MonumentRecognitionResource.java  ← API REST
│   │   │
│   │   ├── resources/
│   │   │   └── ⚙️ application.properties  ← Config
│   │   │
│   │   └── python/                        ← SERVICE PYTHON
│   │       ├── 🐍 monument_recognition.py  ← Cœur du système
│   │       ├── 📋 requirements.txt
│   │       ├── 📄 README.md
│   │       ├── 🧪 test_service.py
│   │       ├── 🚀 start.sh
│   │       ├── 🚀 start.bat
│   │       └── 📦 pytorch_model.bin        ← Placez le modèle ici !
│   │
│   └── src/test/java/
│       └── com/myapp/resources/
│           └── 🧪 MonumentRecognitionResourceTest.java
│
└── frontend/
    ├── 📄 README.md
    ├── 📄 INTEGRATION.md                  ← Guide intégration
    ├── 📄 .env.example                    ← Config à copier
    │
    └── src/
        ├── hooks/
        │   ├── useImageUpload.ts
        │   └── ⭐ useMonumentRecognition.ts  ← Hook principal
        │
        └── components/
            ├── ⭐ MonumentResult.tsx          ← Affichage résultat
            ├── ⭐ MonumentRecognitionDemo.tsx ← Démo complète
            └── 📄 index.tsx
```

## 🎯 Points d'Entrée

### Pour Développeurs Backend

1. **Service Java** : `backend/src/main/java/com/myapp/services/MonumentRecognitionService.java`
2. **API REST** : `backend/src/main/java/com/myapp/resources/MonumentRecognitionResource.java`
3. **Service Python** : `backend/src/main/python/monument_recognition.py`

### Pour Développeurs Frontend

1. **Hook** : `frontend/src/hooks/useMonumentRecognition.ts`
2. **Composant Résultat** : `frontend/src/components/MonumentResult.tsx`
3. **Démo** : `frontend/src/components/MonumentRecognitionDemo.tsx`

### Pour Démarrage Rapide

1. **Installation** : `QUICKSTART.md`
2. **Documentation** : `MONUMENT_RECOGNITION.md`
3. **Tests** : `backend/src/main/python/test_service.py`

## 🔌 Ports Utilisés

```
┌─────────────────────────────────────┐
│  Frontend React/Vite                │
│  http://localhost:5173              │
│  • Interface utilisateur            │
└─────────────────────────────────────┘
              ↕️
┌─────────────────────────────────────┐
│  Backend Quarkus (Java)             │
│  http://localhost:8080              │
│  • API REST                         │
│  • Swagger UI: /swagger-ui          │
└─────────────────────────────────────┘
              ↕️
┌─────────────────────────────────────┐
│  Service Python (Flask)             │
│  http://localhost:5000              │
│  • StreetCLIP                       │
│  • PyTorch                          │
└─────────────────────────────────────┘
```

## 🧩 Composants du Système

### 1️⃣ Service Python (Flask + PyTorch)

```python
# Charge le modèle
model, preprocess = clip.load("ViT-B/32")
state_dict = torch.load("pytorch_model.bin")

# Reconnaît
image_features = model.encode_image(image)
text_features = model.encode_text(monuments)
similarity = (image_features @ text_features.T)
```

### 2️⃣ Backend Quarkus (Java)

```java
@POST
@Path("/recognize")
public Response recognizeMonument(@MultipartForm ImageUploadForm form) {
    MonumentResult result = service.recognizeMonument(form.file);
    return Response.ok(new MonumentResponse(
        result.monument(),
        result.confidence()
    )).build();
}
```

### 3️⃣ Frontend React (TypeScript)

```typescript
const { recognizeMonument, result } = useMonumentRecognition();

const handleUpload = async (file: File) => {
  await recognizeMonument(file);
  // result: { monument: "Tour Eiffel, Paris", confidence: 0.95 }
};
```

## 📊 Exemple Complet de Flux

```
UTILISATEUR
    │
    │ 1. Upload tour_eiffel.jpg
    ▼
FRONTEND (useMonumentRecognition)
    │
    │ 2. POST /api/monuments/recognize
    │    FormData: { file: Blob }
    ▼
BACKEND QUARKUS (MonumentRecognitionResource)
    │
    │ 3. Validation + Transfer
    ▼
SERVICE (MonumentRecognitionService)
    │
    │ 4. Encode base64
    │    POST http://localhost:5000/recognize
    │    Body: {"image": "iVBORw0KG..."}
    ▼
PYTHON SERVICE (monument_recognition.py)
    │
    │ 5. Décode + Préprocess
    ▼
STREETCLIP (PyTorch)
    │
    │ 6. Analyse + Compare
    │    Similarity scores:
    │    Tour Eiffel, Paris: 0.95 ⭐
    │    Arc de Triomphe, Paris: 0.23
    │    Colisée, Rome: 0.18
    │    ...
    ▼
RÉSULTAT
    │
    │ 7. Return JSON
    │    {"monument": "Tour Eiffel, Paris", "confidence": 0.95}
    ▼
AFFICHAGE
    │
    │ 8. <MonumentResult monument="..." confidence={0.95} />
    │
    └─→ 🏛️ Monument Identifié
        Tour Eiffel
        📍 Paris
        ✅ Haute confiance | Précision: 95.0%
```

## ✅ Checklist de Vérification

Avant de commencer :

- [ ] Java 21+ installé
- [ ] Python 3.8+ installé
- [ ] Node.js 18+ installé
- [ ] `pytorch_model.bin` téléchargé
- [ ] Fichier placé dans `backend/src/main/python/`

Installation :

- [ ] `pip install -r requirements.txt` ✓
- [ ] Service Python démarré (port 5000) ✓
- [ ] Backend Quarkus démarré (port 8080) ✓
- [ ] Frontend démarré (port 5173) ✓

Test :

- [ ] `curl http://localhost:5000/health` retourne 200 ✓
- [ ] `curl http://localhost:8080/api/monuments/health` retourne 200 ✓
- [ ] Upload d'image fonctionne ✓
- [ ] Résultat affiché correctement ✓

## 🎉 Félicitations !

Vous avez maintenant un système complet de reconnaissance de monuments !

**Prochaines étapes suggérées :**
1. Ajoutez plus de monuments dans la liste Python
2. Intégrez dans votre application existante
3. Personnalisez l'UI du composant MonumentResult
4. Déployez en production

**Besoin d'aide ?**
→ Consultez `MONUMENT_RECOGNITION.md` pour la doc complète
→ Lisez `frontend/INTEGRATION.md` pour l'intégration
→ Suivez `QUICKSTART.md` pour le démarrage rapide
