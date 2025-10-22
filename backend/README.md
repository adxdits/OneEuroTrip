# Trip AI - Backend Quarkus

Backend de l'application Trip AI avec service de reconnaissance de monuments utilisant StreetCLIP.

## 🌟 Fonctionnalités

- **Reconnaissance de monuments** : Identifie automatiquement des monuments et lieux touristiques sur des images
- **API REST** : Endpoints pour l'upload d'images et la reconnaissance
- **Service LLM local** : Support pour LLaMA (optionnel)
- **Documentation OpenAPI** : Swagger UI intégré

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐
│   Frontend      │─────▶│  Quarkus Backend │
│   (React)       │◀─────│  (Java 21)       │
└─────────────────┘      └──────────────────┘
                               │
                               ▼
                         ┌──────────────────┐
                         │  Python Service  │
                         │  (StreetCLIP)    │
                         └──────────────────┘
```

## 🚀 Démarrage Rapide

### Prérequis

- Java 21+
- Maven 3.8+
- Python 3.8+ (pour le service de reconnaissance)

### 1. Démarrer le service Python

**Voir le guide détaillé :** [QUICKSTART.md](../QUICKSTART.md)

```bash
cd src/main/python
pip install -r requirements.txt
python monument_recognition.py
```

### 2. Démarrer le backend Quarkus

```bash
./mvnw quarkus:dev
```

L'application démarre sur http://localhost:8080

## 📡 API Endpoints

### Monument Recognition

- `GET /api/monuments/health` - Vérifier la santé du service
- `POST /api/monuments/recognize` - Reconnaître un monument (multipart/form-data)
- `POST /api/monuments/recognize/base64` - Reconnaître un monument (base64)

### Chat (optionnel)

- `POST /api/chat` - Générer du texte avec LLM local

### Documentation

- Swagger UI : http://localhost:8080/swagger-ui
- OpenAPI JSON : http://localhost:8080/q/openapi

## 🧪 Tests

```bash
# Tests unitaires
./mvnw test

# Tests d'intégration
./mvnw verify

# Test du service de reconnaissance
cd src/main/python
python test_service.py /chemin/vers/image.jpg
```

## 📦 Packaging

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
