package com.campuswalk.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AuthController {
    
    /**
     * Verify Supabase session token
     * POST /api/auth/login
     * 
     * Note: Actual authentication is handled by Supabase on the frontend.
     * This endpoint can be used for additional backend validation if needed.
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> payload) {
        try {
            // In a real implementation, you would verify the Supabase JWT token here
            // For now, we'll return a success response
            String token = payload.get("token");
            
            if (token == null || token.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Token required"));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Authentication successful"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body(Map.of("success", false, "message", "Authentication failed"));
        }
    }
    
    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok"));
    }
}
