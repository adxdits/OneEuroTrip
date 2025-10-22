# 📦 Placement du Modèle PyTorch

Le fichier `pytorch_model.bin` du repo StreetCLIP n'est **pas inclus** dans ce repository Git car il est trop volumineux (~350 MB).

## 📥 Où placer le modèle

Placez votre fichier `pytorch_model.bin` dans ce dossier :

```
backend/src/main/python/pytorch_model.bin
```

## 🔗 Obtenir le modèle

Le modèle StreetCLIP peut être obtenu depuis le repository original :
- [StreetCLIP GitHub](https://github.com/gmberton/StreetCLIP)

## ⚙️ Fonctionnement sans le modèle

Si le fichier `pytorch_model.bin` n'est pas présent, le service **fonctionnera quand même** en utilisant le modèle CLIP standard d'OpenAI.

Les résultats seront moins précis pour la reconnaissance de monuments, mais le service sera opérationnel.

## ✅ Vérification

Pour vérifier que le modèle est correctement placé :

```bash
# Windows
dir backend\src\main\python\pytorch_model.bin

# Linux/Mac
ls -lh backend/src/main/python/pytorch_model.bin
```

Le fichier devrait faire environ 350 MB.
