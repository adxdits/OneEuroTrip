package com.myapp.resources;

import com.myapp.services.MonumentRecognitionService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.jboss.resteasy.reactive.MultipartForm;
import org.jboss.resteasy.reactive.PartType;

import java.io.IOException;
import java.util.logging.Logger;

@Path("/api/monuments")
@Tag(name = "Monument Recognition", description = "Endpoints pour la reconnaissance de monuments")
public class MonumentRecognitionResource {

    private static final Logger LOGGER = Logger.getLogger(MonumentRecognitionResource.class.getName());

    @Inject
    MonumentRecognitionService monumentRecognitionService;

    @GET
    @Path("/health")
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(
        summary = "Vérifier la santé du service",
        description = "Vérifie que le service de reconnaissance est opérationnel"
    )
    public Response health() {
        boolean healthy = monumentRecognitionService.checkHealth();
        if (healthy) {
            return Response.ok(new HealthResponse("healthy", "Service is operational")).build();
        } else {
            return Response.status(Response.Status.SERVICE_UNAVAILABLE)
                    .entity(new HealthResponse("unhealthy", "Python service is not available"))
                    .build();
        }
    }

    @POST
    @Path("/recognize")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(
        summary = "Reconnaître un monument",
        description = "Upload une image et identifie le monument ou lieu touristique présent sur l'image"
    )
    @APIResponse(
        responseCode = "200",
        description = "Monument reconnu avec succès",
        content = @Content(schema = @Schema(implementation = MonumentResponse.class))
    )
    @APIResponse(
        responseCode = "400",
        description = "Image invalide ou manquante"
    )
    @APIResponse(
        responseCode = "500",
        description = "Erreur lors de la reconnaissance"
    )
    public Response recognizeMonument(@MultipartForm ImageUploadForm form) {
        try {
            if (form == null || form.file == null || form.file.length == 0) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ErrorResponse("Image file is required"))
                        .build();
            }

            LOGGER.info("Processing image upload (" + form.file.length + " bytes)");

            // Reconnaître le monument
            MonumentRecognitionService.MonumentResult result = 
                    monumentRecognitionService.recognizeMonument(form.file);

            // Retourner la réponse
            return Response.ok(new MonumentResponse(
                result.monument(),
                result.confidence()
            )).build();

        } catch (IllegalArgumentException e) {
            LOGGER.warning("Invalid request: " + e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse(e.getMessage()))
                    .build();
        } catch (IOException e) {
            LOGGER.severe("Error processing image: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse("Error processing image: " + e.getMessage()))
                    .build();
        }
    }

    @POST
    @Path("/recognize/base64")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Operation(
        summary = "Reconnaître un monument (Base64)",
        description = "Envoie une image encodée en base64 pour identifier le monument"
    )
    @APIResponse(
        responseCode = "200",
        description = "Monument reconnu avec succès",
        content = @Content(schema = @Schema(implementation = MonumentResponse.class))
    )
    public Response recognizeMonumentBase64(ImageBase64Request request) {
        try {
            if (request == null || request.image() == null || request.image().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new ErrorResponse("Base64 image is required"))
                        .build();
            }

            // Décoder l'image base64
            byte[] imageBytes = java.util.Base64.getDecoder().decode(request.image());
            
            LOGGER.info("Processing base64 image (" + imageBytes.length + " bytes)");

            // Reconnaître le monument
            MonumentRecognitionService.MonumentResult result = 
                    monumentRecognitionService.recognizeMonument(imageBytes);

            return Response.ok(new MonumentResponse(
                result.monument(),
                result.confidence()
            )).build();

        } catch (IllegalArgumentException e) {
            LOGGER.warning("Invalid base64 image: " + e.getMessage());
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new ErrorResponse("Invalid base64 image: " + e.getMessage()))
                    .build();
        } catch (IOException e) {
            LOGGER.severe("Error processing image: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(new ErrorResponse("Error processing image: " + e.getMessage()))
                    .build();
        }
    }

    // DTOs

    public static class ImageUploadForm {
        @FormParam("file")
        @PartType(MediaType.APPLICATION_OCTET_STREAM)
        public byte[] file;
    }

    @Schema(description = "Image encodée en base64")
    public record ImageBase64Request(
        @Schema(description = "Image encodée en base64", required = true)
        String image
    ) {}

    @Schema(description = "Résultat de la reconnaissance")
    public record MonumentResponse(
        @Schema(description = "Nom du monument et ville", example = "Tour Eiffel, Paris")
        String monument,
        @Schema(description = "Niveau de confiance (0-1)", example = "0.95")
        double confidence
    ) {}

    @Schema(description = "Réponse de santé du service")
    public record HealthResponse(
        String status,
        String message
    ) {}

    @Schema(description = "Message d'erreur")
    public record ErrorResponse(
        String error
    ) {}
}
