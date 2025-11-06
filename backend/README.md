# trip-ai

This project uses Quarkus, the Supersonic Subatomic Java Framework.

If you want to learn more about Quarkus, please visit its website: <https://quarkus.io/>.

## 🖼️ Reconnaissance d'images avec PyTorch/ONNX

Ce projet inclut un service de reconnaissance d'images qui permet d'utiliser des modèles PyTorch en Java via ONNX Runtime.

### 📚 Documentation complète

- **[CONVERSION_GUIDE.md](CONVERSION_GUIDE.md)** - Guide complet de conversion PyTorch → ONNX
- **[EXAMPLES.md](EXAMPLES.md)** - Exemples d'utilisation et d'intégration
- **[convert_model_to_onnx.py](convert_model_to_onnx.py)** - Script de conversion automatique
- **[convert_custom_model.py](convert_custom_model.py)** - Script pour modèles personnalisés
- **[convert.ps1](convert.ps1)** - Script PowerShell automatisé

### 🚀 Démarrage rapide

#### 1. Convertir votre modèle PyTorch (.bin) vers ONNX

```powershell
# Installer les dépendances Python
pip install -r requirements.txt

# Conversion automatique
.\convert.ps1 -ModelPath "chemin\vers\model.bin"

# OU avec Python directement
python convert_model_to_onnx.py
```

#### 2. Copier le modèle dans les ressources

```powershell
Copy-Item model.onnx src\main\resources\
```

#### 3. Lancer l'application

```powershell
.\mvnw.cmd quarkus:dev
```

#### 4. Tester l'API

```bash
# Health check
curl http://localhost:8080/api/image/health

# Reconnaissance d'image
curl -X POST http://localhost:8080/api/image/recognize \
  -F "file=@image.jpg"
```

### 🎯 Endpoints disponibles

- `POST /api/image/recognize` - Reconnaissance d'image
- `GET /api/image/health` - Vérification du service
- `GET /api/image/info` - Informations du modèle

Consultez **[EXAMPLES.md](EXAMPLES.md)** pour plus de détails.

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:

```shell script
./mvnw quarkus:dev
```

> **_NOTE:_**  Quarkus now ships with a Dev UI, which is available in dev mode only at <http://localhost:8080/q/dev/>.

## Packaging and running the application

The application can be packaged using:

```shell script
./mvnw package
```

It produces the `quarkus-run.jar` file in the `target/quarkus-app/` directory.
Be aware that it’s not an _über-jar_ as the dependencies are copied into the `target/quarkus-app/lib/` directory.

The application is now runnable using `java -jar target/quarkus-app/quarkus-run.jar`.

If you want to build an _über-jar_, execute the following command:

```shell script
./mvnw package -Dquarkus.package.jar.type=uber-jar
```

The application, packaged as an _über-jar_, is now runnable using `java -jar target/*-runner.jar`.

## Creating a native executable

You can create a native executable using:

```shell script
./mvnw package -Dnative
```

Or, if you don't have GraalVM installed, you can run the native executable build in a container using:

```shell script
./mvnw package -Dnative -Dquarkus.native.container-build=true
```

You can then execute your native executable with: `./target/trip-ai-1.0.0-SNAPSHOT-runner`

If you want to learn more about building native executables, please consult <https://quarkus.io/guides/maven-tooling>.

## Related Guides

- REST ([guide](https://quarkus.io/guides/rest)): A Jakarta REST implementation utilizing build time processing and Vert.x. This extension is not compatible with the quarkus-resteasy extension, or any of the extensions that depend on it.
- REST Jackson ([guide](https://quarkus.io/guides/rest#json-serialisation)): Jackson serialization support for Quarkus REST. This extension is not compatible with the quarkus-resteasy extension, or any of the extensions that depend on it
- Hibernate ORM with Panache ([guide](https://quarkus.io/guides/hibernate-orm-panache)): Simplify your persistence code for Hibernate ORM via the active record or the repository pattern
- JDBC Driver - PostgreSQL ([guide](https://quarkus.io/guides/datasource)): Connect to the PostgreSQL database via JDBC

## Provided Code

### Hibernate ORM

Create your first JPA entity

[Related guide section...](https://quarkus.io/guides/hibernate-orm)

[Related Hibernate with Panache section...](https://quarkus.io/guides/hibernate-orm-panache)


### REST

Easily start your REST Web Services

[Related guide section...](https://quarkus.io/guides/getting-started-reactive#reactive-jax-rs-resources)
