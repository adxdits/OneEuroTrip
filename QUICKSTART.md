# 🚀 Guide de Démarrage Rapide - Reconnaissance de Monuments

## Étape 1: Préparer le modèle StreetCLIP

Placez votre fichier `pytorch_model.bin` dans le dossier :
```
backend/src/main/python/pytorch_model.bin
```

## Étape 2: Installer les dépendances Python

**Windows (PowerShell) :**
```powershell
cd backend\src\main\python

# Installer les packages
pip install flask torch torchvision pillow ftfy regex tqdm
pip install git+https://github.com/openai/CLIP.git
```

**Linux/Mac :**
```bash
cd backend/src/main/python

# Installer les packages
pip install flask torch torchvision pillow ftfy regex tqdm
pip install git+https://github.com/openai/CLIP.git
```

**Ou utilisez le script d'installation :**
```bash
# Windows
.\install.bat

# Linux/Mac
chmod +x install.sh
./install.sh
```

## Étape 3: Démarrer le service Python

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

Vous devriez voir :
```
INFO:werkzeug: * Running on http://0.0.0.0:5000
Modèle chargé avec succès!
```

## Étape 4: Démarrer le backend Quarkus

**Dans un nouveau terminal :**

```bash
cd backend
./mvnw quarkus:dev
```

Attendez le message :
```
Listening on: http://localhost:8080
```

## Étape 5: Tester le service

### Option A: Avec le script de test

```bash
cd backend/src/main/python
python test_service.py /chemin/vers/image.jpg
```

### Option B: Avec curl

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

### Option C: Avec Swagger UI

Ouvrez votre navigateur :
```
http://localhost:8080/swagger-ui
```

Trouvez l'endpoint `/api/monuments/recognize` et testez-le directement !

## Résultat Attendu

```json
{
  "monument": "Tour Eiffel, Paris",
  "confidence": 0.95
}
```

## 🎯 Intégration avec votre Frontend

Dans votre composant React :

```typescript
const handleImageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('http://localhost:8080/api/monuments/recognize', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  console.log(`Monument détecté: ${result.monument}`);
  console.log(`Confiance: ${(result.confidence * 100).toFixed(1)}%`);
};
```

## ⚠️ Troubleshooting

### Le service Python ne démarre pas
- Vérifiez que Python 3.8+ est installé : `python --version`
- Installez les dépendances : `pip install -r requirements.txt`

### Le backend ne peut pas se connecter au service Python
- Vérifiez que le service Python tourne : `curl http://localhost:5000/health`
- Vérifiez les ports (Python: 5000, Quarkus: 8080)

### Erreur "Modèle non trouvé"
- Le service fonctionnera quand même avec CLIP standard
- Pour utiliser StreetCLIP, placez `pytorch_model.bin` dans `backend/src/main/python/`

## 📚 Documentation Complète

Consultez `MONUMENT_RECOGNITION.md` pour la documentation complète.

## ✅ Checklist

- [ ] Python 3.8+ installé
- [ ] `pytorch_model.bin` copié dans le bon dossier
- [ ] Dépendances Python installées
- [ ] Service Python démarré (port 5000)
- [ ] Backend Quarkus démarré (port 8080)
- [ ] Test avec une image réussi

Bonne reconnaissance de monuments ! 🗼🏛️🗿
