package com.yourcompany.grocery;

import com.yourcompany.grocery.auth.entity.Role;
import com.yourcompany.grocery.auth.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
@RequiredArgsConstructor
public class TestRoleDataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        List<String> roles = List.of(
                "ROLE_CUSTOMER",
                "ROLE_STORE_OWNER",
                "ROLE_STORE_STAFF",
                "ROLE_DELIVERY_PARTNER",
                "ROLE_ADMIN"
        );

        for (String roleId : roles) {
            if (!roleRepository.existsById(roleId)) {
                roleRepository.save(Role.builder()
                        .id(roleId)
                        .name(roleId)
                        .description("Test role " + roleId)
                        .createdAt(Instant.now())
                        .build());
            }
        }
    }
}
