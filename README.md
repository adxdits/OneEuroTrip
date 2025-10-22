# Travel Inspiration App

Une application full-stack pour découvrir des destinations de voyage et identifier des monuments via l'upload d'images.

## ✨ Fonctionnalités

- 🏛️ **Reconnaissance de monuments** : Identifiez automatiquement des monuments et lieux touristiques sur vos photos
- 📸 **Upload d'images** : Envoyez vos photos pour analyse
- 🤖 **IA locale** : Utilise StreetCLIP (PyTorch) pour la reconnaissance et LLaMA 2 pour le texte
- 🎨 **Interface moderne** : UI Material-UI responsive et élégante

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│   Frontend      │─────▶│  Backend Quarkus │─────▶│ Python Service  │
│   React + TS    │◀─────│     (Java 21)    │◀─────│   (StreetCLIP)  │
└─────────────────┘      └──────────────────┘      └─────────────────┘
  Port 5173                   Port 8080                  Port 5000
```

## 🚀 Tech Stack

### Backend
- **Quarkus 3.26** - Framework Java moderne et rapide
- **Java 21** - Dernière version LTS
- **StreetCLIP** - Modèle PyTorch pour la reconnaissance de monuments
- **LLaMA 2** (optionnel) - LLM local pour la génération de texte

### Service Python
- **Flask** - Framework web léger
- **PyTorch** - Deep learning
- **CLIP** - Modèle vision-langage d'OpenAI
- **StreetCLIP** - Fine-tuning de CLIP pour les monuments

### Frontend
- **React 19** avec TypeScript
- **Vite** - Build tool ultra-rapide
- **Material-UI** - Bibliothèque de composants
- **Emotion** - Solution de styling

## 📁 Structure du Projet

```
├── backend/                      # Application backend Quarkus
│   ├── src/main/java/           # Code Java
│   │   └── com/myapp/
│   │       ├── resources/       # Endpoints REST
│   │       └── services/        # Services métier
│   ├── src/main/python/         # Service Python StreetCLIP
│   │   ├── monument_recognition.py
│   │   ├── requirements.txt
│   │   └── start.bat/sh
│   └── pom.xml
├── frontend/                     # Application frontend React
│   ├── src/
│   │   ├── components/          # Composants React
│   │   ├── hooks/               # Hooks personnalisés
│   │   └── types/               # Types TypeScript
│   └── package.json
├── ressources/                   # Ressources additionnelles
├── QUICKSTART.md                # Guide de démarrage rapide
└── MONUMENT_RECOGNITION.md      # Documentation complète
```

## 🚀 Démarrage Rapide

**Consultez [QUICKSTART.md](./QUICKSTART.md) pour un guide détaillé !**

### Prérequis

- **Java 21+**
- **Python 3.8+**
- **Node.js 18+**
- **Fichier `pytorch_model.bin`** du repo StreetCLIP

### Installation Express

#### 1. Service Python (StreetCLIP)

```bash
# Placer le modèle
# Copiez pytorch_model.bin dans backend/src/main/python/

cd backend/src/main/python

# Installer les dépendances
pip install flask torch torchvision pillow ftfy regex tqdm
pip install git+https://github.com/openai/CLIP.git

# Démarrer le service
python monument_recognition.py
```

#### 2. Backend Quarkus

```bash
cd backend
./mvnw quarkus:dev
```

Backend disponible sur `http://localhost:8080`

#### 3. Frontend React

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible sur `http://localhost:5173`

## 📡 API Endpoints

### Reconnaissance de Monuments

```bash
# Vérifier la santé du service
GET http://localhost:8080/api/monuments/health

# Reconnaître un monument (upload de fichier)
POST http://localhost:8080/api/monuments/recognize
Content-Type: multipart/form-data
Body: file=<image>

# Reconnaître un monument (base64)
POST http://localhost:8080/api/monuments/recognize/base64
Content-Type: application/json
Body: {"image": "<base64-string>"}
```

**Exemple de réponse :**
```json
{
  "monument": "Tour Eiffel, Paris",
  "confidence": 0.95
}
```

### Documentation Swagger

Accédez à la documentation interactive :
```
http://localhost:8080/swagger-ui
```

## 🧪 Tests

### Test avec curl

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

### Test avec le script Python

```bash
cd backend/src/main/python
python test_service.py /chemin/vers/image.jpg
```

## 🎨 Utilisation dans le Frontend

```typescript
import { useMonumentRecognition } from './hooks/useMonumentRecognition';
import { MonumentResult } from './components';

const MyComponent = () => {
  const { recognizeMonument, isRecognizing, result } = useMonumentRecognition();

  const handleUpload = async (file: File) => {
    await recognizeMonument(file);
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files[0])} />
      {isRecognizing && <p>Reconnaissance en cours...</p>}
      {result && <MonumentResult monument={result.monument} confidence={result.confidence} />}
    </div>
  );
};
```

**Voir [frontend/INTEGRATION.md](./frontend/INTEGRATION.md) pour plus d'exemples !**

## 🏛️ Monuments Supportés

Le système reconnaît ~30 monuments célèbres dont :
- 🇫🇷 Tour Eiffel, Arc de Triomphe, Notre-Dame, Sacré-Cœur, Louvre (Paris)
- 🇫🇷 Mont Saint-Michel, Versailles, Château de Chambord
- 🇮🇹 Colisée, Tour de Pise (Italie)
- 🇬🇧 Big Ben, Tower Bridge (Londres)
- 🇺🇸 Statue de la Liberté, Golden Gate Bridge
- 🇮🇳 Taj Mahal
- 🇪🇬 Pyramides de Gizeh
- 🇪🇸 Sagrada Familia, Alhambra
- Et bien d'autres...

Pour ajouter de nouveaux monuments, modifiez la liste dans `backend/src/main/python/monument_recognition.py`.

## 📚 Documentation

- 📖 [QUICKSTART.md](./QUICKSTART.md) - Guide de démarrage rapide
- 📖 [MONUMENT_RECOGNITION.md](./MONUMENT_RECOGNITION.md) - Documentation complète du service
- 📖 [frontend/INTEGRATION.md](./frontend/INTEGRATION.md) - Guide d'intégration frontend
- 📖 [backend/src/main/python/README.md](./backend/src/main/python/README.md) - Documentation du service Python

## 🔧 Configuration

### Backend (`backend/src/main/resources/application.properties`)

```properties
# URL du service Python
monument.recognition.service.url=http://localhost:5000

# Taille max des uploads
quarkus.http.limits.max-body-size=10M

# Port du backend
quarkus.http.port=8080
```

### Frontend (`frontend/.env`)

```bash
VITE_API_URL=http://localhost:8080
```

## 🐛 Troubleshooting

### Le service Python ne démarre pas
- Vérifiez Python 3.8+ : `python --version`
- Installez les dépendances : `pip install -r requirements.txt`
- Vérifiez les logs pour les erreurs

### Le backend ne se connecte pas au service Python
- Vérifiez que Python tourne : `curl http://localhost:5000/health`
- Vérifiez l'URL dans `application.properties`

### Modèle PyTorch non trouvé
- Le service fonctionnera avec CLIP standard (moins précis)
- Pour StreetCLIP, placez `pytorch_model.bin` dans `backend/src/main/python/`

### Erreur CORS dans le frontend
- Vérifiez que le backend autorise `http://localhost:5173` dans les origines CORS

## 🚢 Déploiement

### Backend

```bash
cd backend
./mvnw clean package
java -jar target/quarkus-app/quarkus-run.jar
```

### Service Python (Production)

```bash
cd backend/src/main/python
gunicorn -w 4 -b 0.0.0.0:5000 monument_recognition:app
```

### Frontend

```bash
cd frontend
npm run build
# Les fichiers statiques sont dans dist/
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout d'une fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📝 Licence

Ce projet est sous licence MIT.

## 🙏 Remerciements

- [OpenAI CLIP](https://github.com/openai/CLIP) - Modèle vision-langage
- [StreetCLIP](https://github.com/gmberton/StreetCLIP) - Fine-tuning pour monuments
- [Quarkus](https://quarkus.io/) - Framework Java Supersonic
- [React](https://react.dev/) - Bibliothèque UI

---

**Fait avec ❤️ pour l'identification de monuments**


3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

## Features

- Image upload from gallery
- Camera integration for taking photos
- AI-powered destination analysis
- Flight recommendations based on uploaded images

## API Endpoints

- `POST /api/chat` - Generate text using LLM

## Suggestions for a good README

Every project is different, so consider which of these sections apply to yours. The sections used in the template are suggestions for most open source projects. Also keep in mind that while a README can be too long and detailed, too long is better than too short. If you think your README is too long, consider utilizing another form of documentation rather than cutting out information.

## Name
Choose a self-explaining name for your project.

## Description
Let people know what your project can do specifically. Provide context and add a link to any reference visitors might be unfamiliar with. A list of Features or a Background subsection can also be added here. If there are alternatives to your project, this is a good place to list differentiating factors.

## Badges
On some READMEs, you may see small images that convey metadata, such as whether or not all the tests are passing for the project. You can use Shields to add some to your README. Many services also have instructions for adding a badge.

## Visuals
Depending on what you are making, it can be a good idea to include screenshots or even a video (you'll frequently see GIFs rather than actual videos). Tools like ttygif can help, but check out Asciinema for a more sophisticated method.

## Installation
Within a particular ecosystem, there may be a common way of installing things, such as using Yarn, NuGet, or Homebrew. However, consider the possibility that whoever is reading your README is a novice and would like more guidance. Listing specific steps helps remove ambiguity and gets people to using your project as quickly as possible. If it only runs in a specific context like a particular programming language version or operating system or has dependencies that have to be installed manually, also add a Requirements subsection.

## Usage
Use examples liberally, and show the expected output if you can. It's helpful to have inline the smallest example of usage that you can demonstrate, while providing links to more sophisticated examples if they are too long to reasonably include in the README.

## Support
Tell people where they can go to for help. It can be any combination of an issue tracker, a chat room, an email address, etc.

## Roadmap
If you have ideas for releases in the future, it is a good idea to list them in the README.

## Contributing
State if you are open to contributions and what your requirements are for accepting them.

For people who want to make changes to your project, it's helpful to have some documentation on how to get started. Perhaps there is a script that they should run or some environment variables that they need to set. Make these steps explicit. These instructions could also be useful to your future self.

You can also document commands to lint the code or run tests. These steps help to ensure high code quality and reduce the likelihood that the changes inadvertently break something. Having instructions for running tests is especially helpful if it requires external setup, such as starting a Selenium server for testing in a browser.

## Authors and acknowledgment
Show your appreciation to those who have contributed to the project.

## License
For open source projects, say how it is licensed.

## Project status
If you have run out of energy or time for your project, put a note at the top of the README saying that development has slowed down or stopped completely. Someone may choose to fork your project or volunteer to step in as a maintainer or owner, allowing your project to keep going. You can also make an explicit request for maintainers.
