# Service de Reconnaissance de Monuments StreetCLIP

Ce service Python utilise le modèle StreetCLIP pour identifier des monuments et lieux touristiques sur des images.

## Installation

### Prérequis
- Python 3.8 ou supérieur
- pip

### Installation des dépendances

**Windows (PowerShell) :**
```powershell
cd backend\src\main\python

# Option 1: Script automatique
.\install.bat

# Option 2: Manuel
pip install flask torch torchvision pillow ftfy regex tqdm
pip install git+https://github.com/openai/CLIP.git
```

**Linux/Mac :**
```bash
cd backend/src/main/python

# Option 1: Script automatique
chmod +x install.sh
./install.sh

# Option 2: Manuel
pip install flask torch torchvision pillow ftfy regex tqdm
pip install git+https://github.com/openai/CLIP.git
```

**Note importante :** Le module CLIP doit être installé **séparément** depuis GitHub, car il n'est pas disponible sur PyPI.

## Configuration

### Placement du modèle

Placez votre fichier `pytorch_model.bin` dans le dossier `backend/src/main/python/` ou définissez la variable d'environnement `MODEL_PATH` :

```bash
export MODEL_PATH=/chemin/vers/pytorch_model.bin
```

### Variables d'environnement

- `MODEL_PATH` : Chemin vers le fichier du modèle PyTorch (défaut: `pytorch_model.bin`)
- `PORT` : Port du service Flask (défaut: `5000`)

## Utilisation

### Démarrage du service

```bash
cd backend/src/main/python
python monument_recognition.py
```

Le service démarre sur `http://localhost:5000`

### Endpoints disponibles

#### 1. Health Check
```bash
GET /health
```

Retourne le status du service et si le modèle est chargé.

#### 2. Reconnaissance de monument (multipart/form-data)
```bash
POST /recognize
Content-Type: multipart/form-data

file: <image-file>
```

#### 3. Reconnaissance de monument (JSON/base64)
```bash
POST /recognize
Content-Type: application/json

{
  "image": "<base64-encoded-image>"
}
```

### Exemple de réponse

```json
{
  "monument": "Tour Eiffel, Paris",
  "confidence": 0.95
}
```

## Test avec curl

### Upload de fichier
```bash
curl -X POST -F "file=@/chemin/vers/image.jpg" http://localhost:5000/recognize
```

### Base64
```bash
# Encoder une image en base64
base64 image.jpg > image.b64

# Envoyer la requête
curl -X POST http://localhost:5000/recognize \
  -H "Content-Type: application/json" \
  -d "{\"image\": \"$(cat image.b64)\"}"
```

## Monuments supportés

Le service reconnaît actuellement environ 30 monuments célèbres, incluant :
- Tour Eiffel, Paris
- Arc de Triomphe, Paris
- Notre-Dame de Paris, Paris
- Sacré-Cœur, Paris
- Louvre, Paris
- Mont Saint-Michel, Normandie
- Colisée, Rome
- Big Ben, Londres
- Statue de la Liberté, New York
- Taj Mahal, Agra
- etc.

Pour ajouter de nouveaux monuments, modifiez la liste `MONUMENTS` dans `monument_recognition.py`.

## Architecture

Le service utilise :
- **Flask** : Framework web Python
- **PyTorch** : Framework de deep learning
- **CLIP** : Modèle de vision-langage d'OpenAI
- **StreetCLIP** : Fine-tuning de CLIP pour les monuments/lieux

## Intégration avec le backend Quarkus

Le backend Quarkus communique avec ce service Python via HTTP. Assurez-vous que :
1. Le service Python est démarré avant le backend Quarkus
2. L'URL est correctement configurée dans `application.properties` :
   ```properties
   monument.recognition.service.url=http://localhost:5000
   ```

## Troubleshooting

### Le modèle ne se charge pas
- Vérifiez que `pytorch_model.bin` existe dans le bon répertoire
- Vérifiez les logs pour voir si CLIP standard est utilisé en fallback

### Erreurs de mémoire
- Réduisez la taille des images avant envoi
- Si vous n'avez pas de GPU, assurez-vous que PyTorch CPU est installé

### Service non disponible
- Vérifiez que le service Python est bien démarré
- Vérifiez les logs avec `python monument_recognition.py`
- Testez avec `curl http://localhost:5000/health`
