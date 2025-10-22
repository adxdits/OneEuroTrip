#!/usr/bin/env python3
"""
Service de reconnaissance de monuments utilisant StreetCLIP
"""
import os
import sys
import torch
import clip
from flask import Flask, request, jsonify
from PIL import Image
import io
import base64
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Chemin vers le modèle PyTorch
MODEL_PATH = os.environ.get('MODEL_PATH', 'pytorch_model.bin')

# Liste des monuments et lieux touristiques connus
# Format: "Nom du monument, Ville"
MONUMENTS = [
    "Tour Eiffel, Paris",
    "Arc de Triomphe, Paris",
    "Notre-Dame de Paris, Paris",
    "Sacré-Cœur, Paris",
    "Louvre, Paris",
    "Champs-Élysées, Paris",
    "Versailles, Versailles",
    "Mont Saint-Michel, Normandie",
    "Château de Chambord, Loire",
    "Pont du Gard, Nîmes",
    "Carcassonne, Carcassonne",
    "Colisée, Rome",
    "Tour de Pise, Pise",
    "Big Ben, Londres",
    "Tower Bridge, Londres",
    "Statue de la Liberté, New York",
    "Empire State Building, New York",
    "Golden Gate Bridge, San Francisco",
    "Taj Mahal, Agra",
    "Grande Muraille de Chine, Chine",
    "Opéra de Sydney, Sydney",
    "Christ Rédempteur, Rio de Janeiro",
    "Machu Picchu, Pérou",
    "Pyramides de Gizeh, Le Caire",
    "Petra, Jordanie",
    "Acropole, Athènes",
    "Sagrada Familia, Barcelone",
    "Alhambra, Grenade",
    "Neuschwanstein, Bavière",
    "Palais de Buckingham, Londres",
]

# Variables globales pour le modèle
model = None
preprocess = None
device = None


def load_model():
    """Charge le modèle StreetCLIP"""
    global model, preprocess, device
    
    try:
        logger.info("Chargement du modèle StreetCLIP...")
        device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"Utilisation du device: {device}")
        
        # Charger CLIP comme base
        model, preprocess = clip.load("ViT-B/32", device=device)
        
        # Si un modèle StreetCLIP custom existe, charger les poids
        if os.path.exists(MODEL_PATH):
            logger.info(f"Chargement des poids depuis {MODEL_PATH}")
            state_dict = torch.load(MODEL_PATH, map_location=device)
            model.load_state_dict(state_dict, strict=False)
        else:
            logger.warning(f"Modèle {MODEL_PATH} non trouvé, utilisation de CLIP standard")
        
        model.eval()
        logger.info("Modèle chargé avec succès!")
        
    except Exception as e:
        logger.error(f"Erreur lors du chargement du modèle: {e}")
        raise


def recognize_monument(image_bytes):
    """
    Reconnait un monument sur une image
    
    Args:
        image_bytes: bytes de l'image
        
    Returns:
        str: "Nom du monument, Ville" ou message d'erreur
    """
    try:
        # Charger l'image
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        # Prétraiter l'image
        image_input = preprocess(image).unsqueeze(0).to(device)
        
        # Encoder les descriptions des monuments
        text_inputs = torch.cat([clip.tokenize(monument) for monument in MONUMENTS]).to(device)
        
        # Calculer les similarités
        with torch.no_grad():
            image_features = model.encode_image(image_input)
            text_features = model.encode_text(text_inputs)
            
            # Normaliser
            image_features /= image_features.norm(dim=-1, keepdim=True)
            text_features /= text_features.norm(dim=-1, keepdim=True)
            
            # Calculer la similarité
            similarity = (100.0 * image_features @ text_features.T).softmax(dim=-1)
            
        # Obtenir le résultat le plus probable
        values, indices = similarity[0].topk(1)
        confidence = values[0].item()
        best_match_idx = indices[0].item()
        
        result = MONUMENTS[best_match_idx]
        
        logger.info(f"Monument reconnu: {result} (confiance: {confidence:.2%})")
        
        return {
            "monument": result,
            "confidence": confidence
        }
        
    except Exception as e:
        logger.error(f"Erreur lors de la reconnaissance: {e}")
        raise


@app.route('/health', methods=['GET'])
def health():
    """Endpoint de santé"""
    return jsonify({"status": "healthy", "model_loaded": model is not None})


@app.route('/recognize', methods=['POST'])
def recognize():
    """
    Endpoint de reconnaissance de monuments
    
    Accepte:
        - Fichier image multipart/form-data
        - JSON avec image en base64
    
    Retourne:
        JSON: {"monument": "Tour Eiffel, Paris", "confidence": 0.95}
    """
    try:
        if model is None:
            return jsonify({"error": "Modèle non chargé"}), 500
        
        # Récupérer l'image
        image_bytes = None
        
        if 'file' in request.files:
            # Upload de fichier
            file = request.files['file']
            image_bytes = file.read()
        elif request.is_json:
            # Image en base64
            data = request.get_json()
            if 'image' in data:
                image_bytes = base64.b64decode(data['image'])
            else:
                return jsonify({"error": "Champ 'image' manquant"}), 400
        else:
            return jsonify({"error": "Format de requête invalide"}), 400
        
        # Reconnaître le monument
        result = recognize_monument(image_bytes)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Erreur: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Charger le modèle au démarrage
    load_model()
    
    # Démarrer le serveur
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
