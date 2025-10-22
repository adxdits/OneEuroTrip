"""
Script de test pour le service de reconnaissance de monuments
"""
import requests
import base64
import sys
import os

# Configuration
BACKEND_URL = "http://localhost:8080"
PYTHON_SERVICE_URL = "http://localhost:5000"


def test_python_service_health():
    """Test la santé du service Python"""
    print("🔍 Test du service Python...")
    try:
        response = requests.get(f"{PYTHON_SERVICE_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Service Python opérationnel: {data}")
            return True
        else:
            print(f"   ✗ Service Python retourne {response.status_code}")
            return False
    except Exception as e:
        print(f"   ✗ Service Python non accessible: {e}")
        return False


def test_backend_health():
    """Test la santé du backend Quarkus"""
    print("🔍 Test du backend Quarkus...")
    try:
        response = requests.get(f"{BACKEND_URL}/api/monuments/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Backend opérationnel: {data}")
            return True
        else:
            print(f"   ✗ Backend retourne {response.status_code}")
            return False
    except Exception as e:
        print(f"   ✗ Backend non accessible: {e}")
        return False


def test_recognize_with_file(image_path):
    """Test la reconnaissance avec upload de fichier"""
    print(f"\n🖼️  Test reconnaissance avec fichier: {image_path}")
    
    if not os.path.exists(image_path):
        print(f"   ✗ Fichier non trouvé: {image_path}")
        return False
    
    try:
        with open(image_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(
                f"{BACKEND_URL}/api/monuments/recognize",
                files=files,
                timeout=30
            )
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Monument reconnu: {data['monument']}")
            print(f"   ✓ Confiance: {data['confidence']:.2%}")
            return True
        else:
            print(f"   ✗ Erreur {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"   ✗ Erreur: {e}")
        return False


def test_recognize_with_base64(image_path):
    """Test la reconnaissance avec base64"""
    print(f"\n🖼️  Test reconnaissance avec base64: {image_path}")
    
    if not os.path.exists(image_path):
        print(f"   ✗ Fichier non trouvé: {image_path}")
        return False
    
    try:
        with open(image_path, 'rb') as f:
            image_bytes = f.read()
        
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        
        response = requests.post(
            f"{BACKEND_URL}/api/monuments/recognize/base64",
            json={"image": base64_image},
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"   ✓ Monument reconnu: {data['monument']}")
            print(f"   ✓ Confiance: {data['confidence']:.2%}")
            return True
        else:
            print(f"   ✗ Erreur {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"   ✗ Erreur: {e}")
        return False


def main():
    print("=" * 60)
    print("TEST DU SERVICE DE RECONNAISSANCE DE MONUMENTS")
    print("=" * 60)
    print()
    
    # Test de santé
    python_ok = test_python_service_health()
    backend_ok = test_backend_health()
    
    if not python_ok or not backend_ok:
        print("\n❌ Les services ne sont pas tous opérationnels.")
        print("\nAssurez-vous que :")
        print("  1. Le service Python est démarré (python monument_recognition.py)")
        print("  2. Le backend Quarkus est démarré (./mvnw quarkus:dev)")
        sys.exit(1)
    
    print("\n✅ Tous les services sont opérationnels!")
    
    # Test avec une image si fournie
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        test_recognize_with_file(image_path)
        test_recognize_with_base64(image_path)
    else:
        print("\n💡 Pour tester avec une image :")
        print(f"   python {sys.argv[0]} /chemin/vers/image.jpg")
    
    print("\n" + "=" * 60)
    print("TESTS TERMINÉS")
    print("=" * 60)


if __name__ == "__main__":
    main()
