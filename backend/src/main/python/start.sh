#!/bin/bash
# Script de démarrage du service de reconnaissance de monuments

echo "=== Service de Reconnaissance de Monuments StreetCLIP ==="
echo ""

# Vérifier que Python est installé
if ! command -v python3 &> /dev/null; then
    echo "❌ Erreur: Python 3 n'est pas installé"
    exit 1
fi

echo "✓ Python détecté: $(python3 --version)"
echo ""

# Vérifier que le modèle existe
MODEL_PATH="${MODEL_PATH:-pytorch_model.bin}"
if [ ! -f "$MODEL_PATH" ]; then
    echo "⚠️  Attention: Modèle non trouvé à $MODEL_PATH"
    echo "   Le service utilisera CLIP standard comme fallback"
    echo ""
fi

# Vérifier les dépendances
echo "Vérification des dépendances Python..."
if ! python3 -c "import flask, torch, PIL" &> /dev/null; then
    echo "Installation des dépendances..."
    pip3 install -r requirements.txt
    echo ""
fi

echo "✓ Dépendances installées"
echo ""

# Démarrer le service
PORT="${PORT:-5000}"
echo "Démarrage du service sur http://localhost:$PORT"
echo "Appuyez sur Ctrl+C pour arrêter"
echo ""

python3 monument_recognition.py
