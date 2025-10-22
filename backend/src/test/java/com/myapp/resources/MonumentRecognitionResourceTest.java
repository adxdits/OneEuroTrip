package com.myapp.resources;

import static org.hamcrest.CoreMatchers.notNullValue;
import org.junit.jupiter.api.Test;

import io.quarkus.test.junit.QuarkusTest;
import static io.restassured.RestAssured.given;
import io.restassured.http.ContentType;

@QuarkusTest
public class MonumentRecognitionResourceTest {

    @Test
    public void testHealthEndpoint() {
        given()
            .when().get("/api/monuments/health")
            .then()
            .statusCode(200)
            .body("status", notNullValue());
    }

    // Test commenté car nécessite une vraie image et le service Python actif
    /*
    @Test
    public void testRecognizeWithFile() throws Exception {
        File imageFile = new File("src/test/resources/test-image.jpg");
        
        given()
            .multiPart("file", imageFile)
            .contentType("multipart/form-data")
            .when()
            .post("/api/monuments/recognize")
            .then()
            .statusCode(200)
            .body("monument", notNullValue())
            .body("confidence", notNullValue());
    }
    
    @Test
    public void testRecognizeWithBase64() throws Exception {
        byte[] imageBytes = Files.readAllBytes(Paths.get("src/test/resources/test-image.jpg"));
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);
        
        given()
            .contentType(ContentType.JSON)
            .body("{\"image\": \"" + base64Image + "\"}")
            .when()
            .post("/api/monuments/recognize/base64")
            .then()
            .statusCode(200)
            .body("monument", notNullValue())
            .body("confidence", notNullValue());
    }
    */

    @Test
    public void testRecognizeWithoutFile() {
        given()
            .contentType("multipart/form-data")
            .when()
            .post("/api/monuments/recognize")
            .then()
            .statusCode(400)
            .body("error", notNullValue());
    }

    @Test
    public void testRecognizeBase64WithoutImage() {
        given()
            .contentType(ContentType.JSON)
            .body("{}")
            .when()
            .post("/api/monuments/recognize/base64")
            .then()
            .statusCode(400)
            .body("error", notNullValue());
    }

    @Test
    public void testRecognizeBase64WithInvalidBase64() {
        given()
            .contentType(ContentType.JSON)
            .body("{\"image\": \"invalid-base64!!!\"}")
            .when()
            .post("/api/monuments/recognize/base64")
            .then()
            .statusCode(400)
            .body("error", notNullValue());
    }
}
