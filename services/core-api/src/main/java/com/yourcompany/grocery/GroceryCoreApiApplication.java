package com.yourcompany.grocery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class GroceryCoreApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(GroceryCoreApiApplication.class, args);
    }
}
