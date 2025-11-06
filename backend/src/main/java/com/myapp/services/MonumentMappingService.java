package com.myapp.services;

import jakarta.enterprise.context.ApplicationScoped;
import java.util.*;

@ApplicationScoped
public class MonumentMappingService {
    
    private static final Map<String, List<String>> IMAGENET_TO_MONUMENT = new HashMap<>();
    
    static {
        IMAGENET_TO_MONUMENT.put("palace", Arrays.asList("Palace of Versailles", "Buckingham Palace", "Forbidden City"));
        IMAGENET_TO_MONUMENT.put("castle", Arrays.asList("Neuschwanstein Castle", "Windsor Castle", "Edinburgh Castle"));
        IMAGENET_TO_MONUMENT.put("church", Arrays.asList("Notre-Dame Cathedral", "Sagrada Familia", "St. Peter's Basilica"));
        IMAGENET_TO_MONUMENT.put("mosque", Arrays.asList("Blue Mosque", "Hagia Sophia", "Sheikh Zayed Mosque"));
        IMAGENET_TO_MONUMENT.put("temple", Arrays.asList("Angkor Wat", "Borobudur", "Golden Temple"));
        IMAGENET_TO_MONUMENT.put("tower", Arrays.asList("Eiffel Tower", "Big Ben", "Leaning Tower of Pisa", "CN Tower"));
        IMAGENET_TO_MONUMENT.put("bridge", Arrays.asList("Golden Gate Bridge", "Tower Bridge", "Brooklyn Bridge"));
        IMAGENET_TO_MONUMENT.put("dome", Arrays.asList("Taj Mahal", "Dome of the Rock", "US Capitol"));
        IMAGENET_TO_MONUMENT.put("arch", Arrays.asList("Arc de Triomphe", "Gateway Arch", "Brandenburg Gate"));
        IMAGENET_TO_MONUMENT.put("monument", Arrays.asList("Statue of Liberty", "Christ the Redeemer", "Lincoln Memorial"));
        IMAGENET_TO_MONUMENT.put("pyramid", Arrays.asList("Pyramids of Giza", "Louvre Pyramid", "Chichen Itza"));
        IMAGENET_TO_MONUMENT.put("amphitheater", Arrays.asList("Colosseum", "Roman Forum", "Arena di Verona"));
        IMAGENET_TO_MONUMENT.put("cliff", Arrays.asList("Mount Rushmore", "Petra", "Cliffs of Moher"));
        IMAGENET_TO_MONUMENT.put("monastery", Arrays.asList("Meteora", "Mont Saint-Michel", "Tiger's Nest"));
    }
    
    public List<String> suggestMonuments(String imagenetLabel) {
        String lowerLabel = imagenetLabel.toLowerCase();
        
        for (Map.Entry<String, List<String>> entry : IMAGENET_TO_MONUMENT.entrySet()) {
            if (lowerLabel.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        
        return Collections.emptyList();
    }
    
    public Map<String, Object> enrichWithMonuments(Map<String, Object> prediction) {
        Map<String, Object> enriched = new HashMap<>(prediction);
        
        if (prediction.containsKey("label")) {
            String label = (String) prediction.get("label");
            List<String> possibleMonuments = suggestMonuments(label);
            
            if (!possibleMonuments.isEmpty()) {
                enriched.put("possibleMonuments", possibleMonuments);
                enriched.put("monumentHint", "Image looks like a " + label + ", possibly: " + String.join(", ", possibleMonuments));
            }
        }
        
        return enriched;
    }
}
