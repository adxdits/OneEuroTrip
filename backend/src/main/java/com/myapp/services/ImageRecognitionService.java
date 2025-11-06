package com.myapp.services;

import ai.onnxruntime.*;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import javax.imageio.ImageIO;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.*;

@ApplicationScoped
public class ImageRecognitionService {

    @Inject
    MonumentMappingService monumentMapping;

    private OrtEnvironment env;
    private OrtSession session;
    private static final int IMG_SIZE = 224;
    private List<String> labels;

    @PostConstruct
    public void init() {
        try {
            env = OrtEnvironment.getEnvironment();
            InputStream modelStream = getClass().getResourceAsStream("/model.onnx");
            if (modelStream == null) {
                throw new RuntimeException("Modèle non trouvé");
            }
            
            byte[] modelBytes = modelStream.readAllBytes();
            session = env.createSession(modelBytes);
            
            loadLabels();
            
            System.out.println("✓ Modèle chargé");
            
        } catch (Exception e) {
            throw new RuntimeException("Erreur chargement", e);
        }
    }
    
    private void loadLabels() {
        try {
            InputStream labelStream = getClass().getResourceAsStream("/imagenet_labels.txt");
            if (labelStream != null) {
                labels = new java.io.BufferedReader(new java.io.InputStreamReader(labelStream))
                    .lines()
                    .toList();
                System.out.println("✓ " + labels.size() + " labels chargés");
            }
        } catch (Exception e) {
            System.out.println("⚠ Labels non chargés: " + e.getMessage());
        }
    }

    public Map<String, Object> recognizeImage(byte[] imageBytes) throws Exception {
        BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
        if (image == null) throw new IllegalArgumentException("Image invalide");

        BufferedImage resized = new BufferedImage(IMG_SIZE, IMG_SIZE, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = resized.createGraphics();
        graphics.drawImage(image, 0, 0, IMG_SIZE, IMG_SIZE, null);
        graphics.dispose();

        float[][][][] inputData = new float[1][3][IMG_SIZE][IMG_SIZE];
        float[] mean = {0.485f, 0.456f, 0.406f};
        float[] std = {0.229f, 0.224f, 0.225f};

        for (int y = 0; y < IMG_SIZE; y++) {
            for (int x = 0; x < IMG_SIZE; x++) {
                int rgb = resized.getRGB(x, y);
                float red = ((rgb >> 16) & 0xFF) / 255.0f;
                float green = ((rgb >> 8) & 0xFF) / 255.0f;
                float blue = (rgb & 0xFF) / 255.0f;
                
                inputData[0][0][y][x] = (red - mean[0]) / std[0];
                inputData[0][1][y][x] = (green - mean[1]) / std[1];
                inputData[0][2][y][x] = (blue - mean[2]) / std[2];
            }
        }

        String inputName = session.getInputNames().iterator().next();
        OnnxTensor inputTensor = OnnxTensor.createTensor(env, inputData);
        
        Map<String, OnnxTensor> inputs = Collections.singletonMap(inputName, inputTensor);
        OrtSession.Result results = session.run(inputs);
        
        System.out.println("Nombre de sorties: " + results.size());
        System.out.println("Noms des sorties: " + session.getOutputNames());
        
        String probsOutputName = null;
        for (String name : session.getOutputNames()) {
            if (!name.contains("ArgMax")) {
                probsOutputName = name;
                break;
            }
        }
        
        if (probsOutputName == null) {
            probsOutputName = session.getOutputNames().iterator().next();
        }
        
        final String outputName = probsOutputName;
        System.out.println("Utilisation de la sortie: " + outputName);
        
        OnnxValue outputValue = results.get(outputName).orElseThrow(() -> 
            new RuntimeException("Sortie '" + outputName + "' non trouvée"));
        
        Object outputObj = outputValue.getValue();
        System.out.println("Type de sortie: " + outputObj.getClass().getName());
        
        float[] logits;
        
        if (outputObj instanceof float[][]) {
            logits = ((float[][]) outputObj)[0];
        } else if (outputObj instanceof float[]) {
            logits = (float[]) outputObj;
        } else if (outputObj instanceof long[][]) {
            long[][] longOutput = (long[][]) outputObj;
            logits = new float[longOutput[0].length];
            for (int i = 0; i < longOutput[0].length; i++) {
                logits[i] = (float) longOutput[0][i];
            }
        } else if (outputObj instanceof long[]) {
            long[] longOutput = (long[]) outputObj;
            logits = new float[longOutput.length];
            for (int i = 0; i < longOutput.length; i++) {
                logits[i] = (float) longOutput[i];
            }
        } else {
            throw new RuntimeException("Type de sortie inattendu: " + outputObj.getClass().getName());
        }
        
        float[] probs = softmax(logits);
        int topClass = argmax(probs);
        
        System.out.println("Nombre de classes: " + probs.length);
        System.out.println("Top class: " + topClass + " (prob=" + probs[topClass] + ")");
        
        Map<String, Object> response = new HashMap<>();
        response.put("topClass", topClass);
        response.put("confidence", probs[topClass]);
        if (labels != null && topClass < labels.size()) {
            response.put("label", labels.get(topClass));
        }
        
        int k = Math.min(5, probs.length);
        List<Map<String, Object>> predictions = new ArrayList<>();
        int[] topIndices = topK(probs, k);
        for (int idx : topIndices) {
            Map<String, Object> pred = new HashMap<>();
            pred.put("class", idx);
            pred.put("probability", probs[idx]);
            if (labels != null && idx < labels.size()) {
                pred.put("label", labels.get(idx));
            }
            predictions.add(pred);
        }
        response.put("predictions", predictions);
        
        response = monumentMapping.enrichWithMonuments(response);
        
        inputTensor.close();
        results.close();
        
        return response;
    }

    private float[] softmax(float[] logits) {
        float max = Float.NEGATIVE_INFINITY;
        for (float v : logits) if (v > max) max = v;
        
        float sum = 0;
        float[] probs = new float[logits.length];
        for (int i = 0; i < logits.length; i++) {
            probs[i] = (float) Math.exp(logits[i] - max);
            sum += probs[i];
        }
        for (int i = 0; i < probs.length; i++) probs[i] /= sum;
        return probs;
    }

    private int argmax(float[] arr) {
        int maxIdx = 0;
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > arr[maxIdx]) maxIdx = i;
        }
        return maxIdx;
    }

    private int[] topK(float[] arr, int k) {
        Integer[] indices = new Integer[arr.length];
        for (int i = 0; i < arr.length; i++) indices[i] = i;
        Arrays.sort(indices, (a, b) -> Float.compare(arr[b], arr[a]));
        int[] result = new int[k];
        for (int i = 0; i < k; i++) result[i] = indices[i];
        return result;
    }

    @PreDestroy
    public void cleanup() {
        try {
            if (session != null) session.close();
            if (env != null) env.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
