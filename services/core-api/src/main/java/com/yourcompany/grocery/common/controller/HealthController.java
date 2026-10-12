package com.yourcompany.grocery.common.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/healthz")
    public ResponseEntity<Map<String, Object>> healthz() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "grocery-core-api",
                "timestamp", Instant.now().toString()
        ));
    }
}
