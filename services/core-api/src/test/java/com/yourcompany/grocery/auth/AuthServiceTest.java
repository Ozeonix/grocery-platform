package com.yourcompany.grocery.auth;

import com.yourcompany.grocery.auth.dto.AuthResponse;
import com.yourcompany.grocery.auth.dto.LoginRequest;
import com.yourcompany.grocery.auth.dto.RegisterRequest;
import com.yourcompany.grocery.auth.entity.Role;
import com.yourcompany.grocery.auth.repository.RoleRepository;
import com.yourcompany.grocery.auth.security.JwtTokenProvider;
import com.yourcompany.grocery.auth.security.UserPrincipal;
import com.yourcompany.grocery.auth.service.AuthService;
import com.yourcompany.grocery.common.exception.ConflictException;
import com.yourcompany.grocery.users.entity.User;
import com.yourcompany.grocery.users.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private Role customerRole;

    @BeforeEach
    void setUp() {
        customerRole = Role.builder().id("ROLE_CUSTOMER").name("ROLE_CUSTOMER").description("Customer").build();
    }

    @Test
    @DisplayName("Register new user successfully")
    void testRegister_Success() {
        RegisterRequest request = RegisterRequest.builder()
                .email("bhola@ozeonix.com")
                .password("SecurePass123!")
                .firstName("Bhola")
                .lastName("Dev")
                .phone("+9779800000000")
                .build();

        when(userRepository.existsByEmail("bhola@ozeonix.com")).thenReturn(false);
        when(userRepository.existsByPhone("+9779800000000")).thenReturn(false);
        when(roleRepository.findById("ROLE_CUSTOMER")).thenReturn(Optional.of(customerRole));
        when(passwordEncoder.encode("SecurePass123!")).thenReturn("hashed_password");

        User savedUser = User.builder()
                .id(UUID.randomUUID())
                .email("bhola@ozeonix.com")
                .firstName("Bhola")
                .lastName("Dev")
                .roles(Collections.singleton(customerRole))
                .build();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        when(tokenProvider.generateAccessToken(any(UserPrincipal.class))).thenReturn("mock_access_jwt");
        when(tokenProvider.generateRefreshToken(any(UserPrincipal.class))).thenReturn("mock_refresh_jwt");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock_access_jwt", response.getAccessToken());
        assertEquals("mock_refresh_jwt", response.getRefreshToken());
        assertEquals("bhola@ozeonix.com", response.getUser().getEmail());

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Register with existing email throws ConflictException")
    void testRegister_DuplicateEmail_ThrowsConflict() {
        RegisterRequest request = RegisterRequest.builder()
                .email("existing@ozeonix.com")
                .password("Password123!")
                .build();

        when(userRepository.existsByEmail("existing@ozeonix.com")).thenReturn(true);

        assertThrows(ConflictException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Login with valid credentials returns tokens")
    void testLogin_Success() {
        LoginRequest request = LoginRequest.builder()
                .email("bhola@ozeonix.com")
                .password("SecurePass123!")
                .build();

        User user = User.builder()
                .id(UUID.randomUUID())
                .email("bhola@ozeonix.com")
                .firstName("Bhola")
                .lastName("Dev")
                .roles(Collections.singleton(customerRole))
                .active(true)
                .build();

        UserPrincipal principal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(tokenProvider.generateAccessToken(principal)).thenReturn("valid_jwt_token");
        when(tokenProvider.generateRefreshToken(principal)).thenReturn("valid_refresh_token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("valid_jwt_token", response.getAccessToken());
        assertEquals("valid_refresh_token", response.getRefreshToken());
    }
}
