# Service de Reconnaissance de Monuments - Guide d'Utilisation

## 🎯 Objectif

Ce système permet d'identifier automatiquement des monuments et lieux touristiques sur des images et retourne le résultat au format : **"Nom du monument, Ville"**

**Exemple** : Image de la Tour Eiffel → `"Tour Eiffel, Paris"`

## 🏗️ Architecture

Le système est composé de deux parties :

1. **Service Python (StreetCLIP)** : Traite les images avec PyTorch et le modèle StreetCLIP
2. **Backend Quarkus (Java)** : Expose les API REST et communique avec le service Python

```
┌─────────────┐      ┌──────────────┐      ┌─────────────────┐
│   Frontend  │─────▶│   Quarkus    │─────▶│  Python Service │
│  (React)    │◀─────│   Backend    │◀─────│   (StreetCLIP)  │
└─────────────┘      └──────────────┘      └─────────────────┘
                      Port 8080              Port 5000
```

## 📋 Prérequis

### Pour le service Python
- Python 3.8+
- pip
- Fichier `pytorch_model.bin` du repo StreetCLIP

### Pour le backend Quarkus
- Java 21
- Maven 3.8+

## 🚀 Installation

### 1. Placer le modèle StreetCLIP

Copiez votre fichier `pytorch_model.bin` dans le dossier :
```
backend/src/main/python/pytorch_model.bin
```

### 2. Installer les dépendances Python

**Windows :**
```powershell
cd backend\src\main\python
pip install -r requirements.txt
```

**Linux/Mac :**
```bash
cd backend/src/main/python
pip install -r requirements.txt
```

### 3. Installer les dépendances Java

```bash
cd backend
./mvnw clean install
```

## ▶️ Démarrage

### 1. Démarrer le service Python

**Windows :**
```powershell
cd backend\src\main\python
.\start.bat
```

**Linux/Mac :**
```bash
cd backend/src/main/python
chmod +x start.sh
./start.sh
```

**Ou manuellement :**
```bash
cd backend/src/main/python
python monument_recognition.py
```

Le service démarre sur `http://localhost:5000`

### 2. Démarrer le backend Quarkus

**Dans un nouveau terminal :**

```bash
cd backend
./mvnw quarkus:dev
```

Le backend démarre sur `http://localhost:8080`

## 📡 API Endpoints

### Backend Quarkus

#### 1. Vérifier la santé du service
```bash
GET http://localhost:8080/api/monuments/health
```

**Réponse :**
```json
{
  "status": "healthy",
  "message": "Service is operational"
}
```

#### 2. Reconnaître un monument (Upload de fichier)
```bash
POST http://localhost:8080/api/monuments/recognize
Content-Type: multipart/form-data

file: <image-file>
```

**Exemple avec curl :**
```bash
curl -X POST http://localhost:8080/api/monuments/recognize \
  -F "file=@/chemin/vers/image.jpg"
```

**Réponse :**
```json
{
  "monument": "Tour Eiffel, Paris",
  "confidence": 0.95
}
```

#### 3. Reconnaître un monument (Base64)
```bash
POST http://localhost:8080/api/monuments/recognize/base64
Content-Type: application/json

{
  "image": "<base64-encoded-image>"
}
```

**Réponse :**
```json
{
  "monument": "Arc de Triomphe, Paris",
  "confidence": 0.89
}
```

### Documentation Swagger

Accédez à la documentation interactive :
```
http://localhost:8080/swagger-ui
```

## 🧪 Tests

### Test avec curl (Upload)

**Windows (PowerShell) :**
```powershell
curl.exe -X POST http://localhost:8080/api/monuments/recognize `
  -F "file=@C:\chemin\vers\image.jpg"
```

**Linux/Mac :**
```bash
curl -X POST http://localhost:8080/api/monuments/recognize \
  -F "file=@/chemin/vers/image.jpg"
```

### Test avec Python

```python
import requests

# Upload de fichier
url = "http://localhost:8080/api/monuments/recognize"
files = {'file': open('tour_eiffel.jpg', 'rb')}
response = requests.post(url, files=files)
print(response.json())
# {"monument": "Tour Eiffel, Paris", "confidence": 0.95}
```

### Test avec JavaScript (Frontend)

```javascript
const formData = new FormData();
formData.append('file', imageFile);

const response = await fetch('http://localhost:8080/api/monuments/recognize', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(result.monument); // "Tour Eiffel, Paris"
```

## 🎨 Monuments Supportés

Le service reconnaît actuellement ~30 monuments célèbres :

### France
- Tour Eiffel, Paris
- Arc de Triomphe, Paris
- Notre-Dame de Paris, Paris
- Sacré-Cœur, Paris
- Louvre, Paris
- Versailles, Versailles
- Mont Saint-Michel, Normandie
- Château de Chambord, Loire
- Pont du Gard, Nîmes
- Carcassonne, Carcassonne

### International
- Colisée, Rome
- Tour de Pise, Pise
- Big Ben, Londres
- Tower Bridge, Londres
- Statue de la Liberté, New York
- Taj Mahal, Agra
- Pyramides de Gizeh, Le Caire
- Sagrada Familia, Barcelone
- etc.

**Pour ajouter de nouveaux monuments**, modifiez la liste `MONUMENTS` dans `monument_recognition.py`.

## ⚙️ Configuration

### Backend Quarkus (`application.properties`)

```properties
# URL du service Python
monument.recognition.service.url=http://localhost:5000

# Taille maximale des uploads
quarkus.http.limits.max-body-size=10M
```

### Service Python (Variables d'environnement)

```bash
# Chemin vers le modèle
export MODEL_PATH=/chemin/vers/pytorch_model.bin

# Port du service
export PORT=5000
```

## 🐛 Troubleshooting

### Le service Python ne démarre pas

1. **Vérifier Python :**
   ```bash
   python --version
   # Doit être 3.8+
   ```

2. **Installer les dépendances :**
   ```bash
   pip install -r requirements.txt
   ```

3. **Vérifier les logs :**
   Le service affiche des logs détaillés au démarrage

### Le backend Quarkus ne peut pas se connecter au service Python

1. **Vérifier que le service Python est bien démarré :**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Vérifier l'URL dans `application.properties` :**
   ```properties
   monument.recognition.service.url=http://localhost:5000
   ```

3. **Tester le endpoint health du backend :**
   ```bash
   curl http://localhost:8080/api/monuments/health
   ```

### Erreurs de mémoire (Out of Memory)

- Réduisez la taille des images avant envoi (max 2-3 MB recommandé)
- Si pas de GPU, PyTorch utilisera le CPU (plus lent mais fonctionnel)

### Le modèle ne se charge pas

Si `pytorch_model.bin` n'existe pas, le service utilisera **CLIP standard** comme fallback.
Les résultats seront moins précis mais le service fonctionnera quand même.

## 📊 Performances

- **Temps de reconnaissance** : ~1-3 secondes par image (CPU)
- **Taille maximale d'image** : 10 MB
- **Formats supportés** : JPEG, PNG, BMP, GIF

## 🔒 Sécurité

- Le service valide la taille des fichiers uploadés
- Les images sont traitées en mémoire et ne sont pas sauvegardées
- CORS configuré pour le frontend

## 📝 Logs

### Service Python
Les logs apparaissent dans la console où le service est démarré.

### Backend Quarkus
Les logs Quarkus apparaissent dans le mode dev (`quarkus:dev`).

## 🚢 Déploiement en Production

Pour déployer en production :

1. **Service Python** : Utilisez Gunicorn ou uWSGI
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 monument_recognition:app
   ```

2. **Backend Quarkus** : Compilez en mode production
   ```bash
   ./mvnw clean package
   java -jar target/quarkus-app/quarkus-run.jar
   ```

3. **Docker** : Des Dockerfiles sont disponibles dans `backend/src/main/docker/`

## 📚 Ressources

- [Documentation Quarkus](https://quarkus.io/)
- [Documentation CLIP](https://github.com/openai/CLIP)
- [StreetCLIP Repository](https://github.com/gmberton/StreetCLIP)
- [Flask Documentation](https://flask.palletsprojects.com/)

## 🤝 Support

Pour toute question ou problème :
1. Vérifiez la section Troubleshooting
2. Consultez les logs des deux services
3. Testez chaque service indépendamment
