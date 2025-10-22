# Commit Message Suggéré

## Titre
feat: Add monument recognition service with StreetCLIP integration

## Description
Implémentation complète d'un service de reconnaissance de monuments utilisant StreetCLIP (PyTorch) avec intégration backend Quarkus.

### Backend
- Nouveau service Python Flask pour reconnaissance de monuments
- Utilise CLIP/StreetCLIP pour identifier ~30 monuments célèbres
- Service Java MonumentRecognitionService pour communication HTTP
- API REST avec 3 endpoints:
  - GET /api/monuments/health
  - POST /api/monuments/recognize (multipart)
  - POST /api/monuments/recognize/base64
- Documentation OpenAPI/Swagger complète

### Frontend (Exemples optionnels)
- Hook React `useMonumentRecognition` pour intégration facile
- Composant `MonumentResult` pour affichage des résultats
- Composant démo complet `MonumentRecognitionDemo`
- Configuration CORS et API URL

### Documentation
- START_HERE.md - Guide de démarrage en 5 minutes
- QUICKSTART.md - Installation et configuration détaillée
- MONUMENT_RECOGNITION.md - Documentation technique complète
- VISUAL_GUIDE.md - Schémas et flux de données
- IMPLEMENTATION_SUMMARY.md - Résumé de l'implémentation
- frontend/INTEGRATION.md - Guide d'intégration frontend

### Fonctionnalités
- ✅ Reconnaissance locale (pas d'API externe)
- ✅ Support multipart et base64
- ✅ Retour au format: "Monument, Ville"
- ✅ Niveau de confiance (0-1)
- ✅ Fallback sur CLIP standard si modèle absent
- ✅ ~30 monuments pré-configurés (extensible)
- ✅ Tests unitaires et scripts de test

### Installation
```bash
# Python
cd backend/src/main/python
pip install flask torch torchvision pillow ftfy regex tqdm
pip install git+https://github.com/openai/CLIP.git
python monument_recognition.py

# Quarkus
cd backend
./mvnw quarkus:dev
```

### Notes
- Le modèle pytorch_model.bin (~350 MB) n'est pas versionné (voir .gitignore)
- Fonctionne sans le modèle (utilise CLIP standard)
- Architecture: React → Quarkus → Flask/Python → StreetCLIP

Co-authored-by: GitHub Copilot <noreply@github.com>
