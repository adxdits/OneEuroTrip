#!/bin/bash
# Script d'installation des dépendances Python pour Linux/Mac

echo "=== Installation des dépendances Python ==="
echo ""

# Installer les dépendances de base
echo "Installation des packages de base..."
pip install flask torch torchvision pillow ftfy regex tqdm

# Installer CLIP depuis GitHub
echo ""
echo "Installation de CLIP depuis GitHub..."
pip install git+https://github.com/openai/CLIP.git

echo ""
echo "=== Installation terminée ==="
echo ""
echo "Vous pouvez maintenant lancer le service avec:"
echo "python monument_recognition.py"
