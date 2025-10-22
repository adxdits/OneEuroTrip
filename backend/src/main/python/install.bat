@echo off
REM Script d'installation des dépendances Python pour Windows

echo === Installation des dependances Python ===
echo.

REM Installer les dépendances de base
echo Installation des packages de base...
pip install flask torch torchvision pillow ftfy regex tqdm

REM Installer CLIP depuis GitHub
echo.
echo Installation de CLIP depuis GitHub...
pip install git+https://github.com/openai/CLIP.git

echo.
echo === Installation terminee ===
echo.
echo Vous pouvez maintenant lancer le service avec:
echo python monument_recognition.py
