@echo off
REM Script de démarrage du service de reconnaissance de monuments (Windows)

echo === Service de Reconnaissance de Monuments StreetCLIP ===
echo.

REM Vérifier que Python est installé
python --version >nul 2>&1
if errorlevel 1 (
    echo Erreur: Python n'est pas installé
    exit /b 1
)

echo Python detecte
python --version
echo.

REM Vérifier que le modèle existe
if defined MODEL_PATH (
    set MODEL_FILE=%MODEL_PATH%
) else (
    set MODEL_FILE=pytorch_model.bin
)

if not exist "%MODEL_FILE%" (
    echo Attention: Modele non trouve a %MODEL_FILE%
    echo    Le service utilisera CLIP standard comme fallback
    echo.
)

REM Vérifier les dépendances
echo Verification des dependances Python...
python -c "import flask, torch, PIL" >nul 2>&1
if errorlevel 1 (
    echo Installation des dependances...
    pip install -r requirements.txt
    echo.
)

echo Dependances installees
echo.

REM Démarrer le service
if defined PORT (
    set SERVICE_PORT=%PORT%
) else (
    set SERVICE_PORT=5000
)

echo Demarrage du service sur http://localhost:%SERVICE_PORT%
echo Appuyez sur Ctrl+C pour arreter
echo.

python monument_recognition.py
