package com.myapp.services;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.Base64;
import java.util.logging.Logger;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;

@ApplicationScoped
public class MonumentRecognitionService {

    private static final Logger LOGGER = Logger.getLogger(MonumentRecognitionService.class.getName());
    
    @ConfigProperty(name = "monument.recognition.service.url", defaultValue = "http://localhost:5000")
    String pythonServiceUrl;
    
    private HttpClient httpClient;
    private ObjectMapper objectMapper;

    @PostConstruct
    void init() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = new ObjectMapper();
        
        LOGGER.info("Monument Recognition Service initialized with URL: " + pythonServiceUrl);
        
        // Vérifier la santé du service Python
        checkHealth();
    }

    /**
     * Vérifie que le service Python est accessible
     */
    public boolean checkHealth() {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(pythonServiceUrl + "/health"))
                    .GET()
                    .timeout(Duration.ofSeconds(5))
                    .build();
            
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() == 200) {
                LOGGER.info("Python service is healthy");
                return true;
            } else {
                LOGGER.warning("Python service returned status: " + response.statusCode());
                return false;
            }
        } catch (Exception e) {
            LOGGER.warning("Python service is not available: " + e.getMessage());
            return false;
        }
    }

    /**
     * Reconnaît un monument sur une image
     * 
     * @param imageBytes les bytes de l'image
     * @return le nom du monument et la ville au format "Monument, Ville"
     * @throws IOException si une erreur se produit
     */
    public MonumentResult recognizeMonument(byte[] imageBytes) throws IOException {
        if (imageBytes == null || imageBytes.length == 0) {
            throw new IllegalArgumentException("Image bytes cannot be null or empty");
        }
        
        try {
            // Encoder l'image en base64
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            
            // Créer le payload JSON
            String jsonPayload = objectMapper.writeValueAsString(
                new ImageRequest(base64Image)
            );
            
            // Envoyer la requête au service Python
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(pythonServiceUrl + "/recognize"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .timeout(Duration.ofSeconds(30))
                    .build();
            
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            
            if (response.statusCode() == 200) {
                // Parser la réponse
                JsonNode jsonResponse = objectMapper.readTree(response.body());
                String monument = jsonResponse.get("monument").asText();
                double confidence = jsonResponse.get("confidence").asDouble();
                
                LOGGER.info("Monument recognized: " + monument + " (confidence: " + confidence + ")");
                
                return new MonumentResult(monument, confidence);
            } else {
                String errorMsg = "Python service returned error: " + response.statusCode();
                LOGGER.severe(errorMsg);
                throw new IOException(errorMsg + " - " + response.body());
            }
            
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Request interrupted", e);
        }
    }

    /**
     * Reconnaît un monument à partir d'un fichier
     * 
     * @param imagePath le chemin vers le fichier image
     * @return le résultat de la reconnaissance
     * @throws IOException si une erreur se produit
     */
    public MonumentResult recognizeMonumentFromFile(Path imagePath) throws IOException {
        byte[] imageBytes = Files.readAllBytes(imagePath);
        return recognizeMonument(imageBytes);
    }

    // Classes internes pour les requêtes/réponses
    
    private record ImageRequest(String image) {}
    
    public record MonumentResult(
        String monument,
        double confidence
    ) {
        /**
         * Retourne uniquement le texte du monument au format attendu
         */
        public String toText() {
            return monument;
        }
    }
}
