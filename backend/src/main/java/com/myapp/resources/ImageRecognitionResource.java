package com.myapp.resources;

import com.myapp.services.ClipMonumentService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import java.nio.file.Files;
import java.util.Map;

@Path("/api/image")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ImageRecognitionResource {

    @Inject
    ClipMonumentService clipService;

    @POST
    @Path("/recognize")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response recognizeImage(@RestForm("file") FileUpload file) {
        try {
            if (file == null) {
                return Response
                    .status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("error", "Aucun fichier fourni"))
                    .build();
            }

            byte[] imageBytes = Files.readAllBytes(file.uploadedFile());
            Map<String, Object> result = clipService.recognizeMonument(imageBytes);

            return Response.ok(result).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response
                .status(Response.Status.INTERNAL_SERVER_ERROR)
                .entity(Map.of(
                    "error", "Erreur lors de la reconnaissance",
                    "message", e.getMessage()
                ))
                .build();
        }
    }

    @GET
    @Path("/health")
    public Response health() {
        return Response.ok(Map.of(
            "status", "OK",
            "model", "CLIP ViT-B/32",
            "monuments", 30,
            "ready", true
        )).build();
    }
}
