package com.yourcompany.grocery.orders;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yourcompany.grocery.auth.dto.LoginRequest;
import com.yourcompany.grocery.auth.dto.RegisterRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
class CartAndOrderControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String validJwtToken;

    @BeforeEach
    void setUp() throws Exception {
        RegisterRequest regRequest = RegisterRequest.builder()
                .email("cartorder.test@ozeonix.com")
                .password("Password123!")
                .firstName("CartOrder")
                .lastName("Tester")
                .phone("+9779844444444")
                .build();

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(regRequest)));

        LoginRequest loginRequest = LoginRequest.builder()
                .email("cartorder.test@ozeonix.com")
                .password("Password123!")
                .build();

        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andReturn();

        JsonNode loginJson = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        this.validJwtToken = loginJson.path("data").path("accessToken").asText();
    }

    @Test
    @DisplayName("GET /api/v1/cart should return user cart when authenticated")
    void getCartAuthenticated() throws Exception {
        mockMvc.perform(get("/api/v1/cart")
                        .header("Authorization", "Bearer " + validJwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.items").isArray());
    }

    @Test
    @DisplayName("GET /api/v1/cart unauthenticated should return 401")
    void getCartUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/v1/cart"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("GET /api/v1/orders/my-orders should return customer orders when authenticated")
    void getMyOrdersAuthenticated() throws Exception {
        mockMvc.perform(get("/api/v1/orders/my-orders")
                        .header("Authorization", "Bearer " + validJwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("GET /api/v1/orders/my-orders unauthenticated should return 401")
    void getMyOrdersUnauthenticated() throws Exception {
        mockMvc.perform(get("/api/v1/orders/my-orders"))
                .andExpect(status().isUnauthorized());
    }
}
