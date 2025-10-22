# 🚀 DÉMARRAGE EN 5 MINUTES

## Étape 1: Prérequis (2 min)

Vérifiez que vous avez :
```bash
# Java 21+
java -version

# Python 3.8+
python --version

# Node.js 18+ (optionnel pour le frontend)
node --version
```

## Étape 2: Placez le Modèle (30 sec)

Copiez votre fichier `pytorch_model.bin` dans :
```
backend/src/main/python/pytorch_model.bin
```

## Étape 3: Démarrez Python (1 min)

**Windows:**
```powershell
cd backend\src\main\python

# Installer les dépendances
pip install flask torch torchvision pillow ftfy regex tqdm
pip install git+https://github.com/openai/CLIP.git

# Démarrer le service
python monument_recognition.py
```

**Linux/Mac:**
```bash
cd backend/src/main/python

# Installer les dépendances
pip install flask torch torchvision pillow ftfy regex tqdm
pip install git+https://github.com/openai/CLIP.git

# Démarrer le service
python monument_recognition.py
```

✅ Attendez le message : `* Running on http://0.0.0.0:5000`

**Note :** La première fois, le modèle CLIP sera téléchargé (~350 MB), cela peut prendre quelques minutes.

## Étape 4: Démarrez Quarkus (1 min)

**Nouveau terminal:**
```bash
cd backend
./mvnw quarkus:dev
```

✅ Attendez : `Listening on: http://localhost:8080`

## Étape 5: Testez ! (30 sec)

**Option A - Swagger UI (Recommandé):**
1. Ouvrez : http://localhost:8080/swagger-ui
2. Trouvez `POST /api/monuments/recognize`
3. Cliquez "Try it out"
4. Uploadez une image
5. Cliquez "Execute"

**Option B - curl:**

Windows:
```powershell
curl.exe -X POST http://localhost:8080/api/monuments/recognize -F "file=@C:\chemin\vers\image.jpg"
```

Linux/Mac:
```bash
curl -X POST http://localhost:8080/api/monuments/recognize -F "file=@/chemin/vers/image.jpg"
```

**Option C - Script Python:**
```bash
cd backend/src/main/python
python test_service.py /chemin/vers/image.jpg
```

## ✅ Résultat Attendu

```json
{
  "monument": "Tour Eiffel, Paris",
  "confidence": 0.95
}
```

## 🎉 C'est Tout !

Votre service de reconnaissance de monuments est opérationnel !

## 🔗 Liens Utiles

- **Swagger UI**: http://localhost:8080/swagger-ui
- **Service Python Health**: http://localhost:5000/health
- **Backend Health**: http://localhost:8080/api/monuments/health

## 📚 Documentation

- Démarrage complet → `QUICKSTART.md`
- Documentation technique → `MONUMENT_RECOGNITION.md`
- Intégration frontend → `frontend/INTEGRATION.md`
- Guide visuel → `VISUAL_GUIDE.md`

## ❓ Problèmes ?

### Python ne démarre pas
```bash
# Installer les dépendances dans le bon ordre
pip install flask torch torchvision pillow ftfy regex tqdm
pip install git+https://github.com/openai/CLIP.git
```

### Backend ne trouve pas le service Python
Vérifiez que Python tourne :
```bash
curl http://localhost:5000/health
```

### Modèle non trouvé
Le service fonctionnera quand même avec CLIP standard.
Pour utiliser StreetCLIP, placez `pytorch_model.bin` dans `backend/src/main/python/`

## 🚀 Prochaines Étapes

1. ✅ Testez avec vos propres images
2. ✅ Ajoutez des monuments dans `monument_recognition.py`
3. ✅ Intégrez dans votre frontend
4. ✅ Personnalisez l'UI

**Bon développement ! 🎊**
