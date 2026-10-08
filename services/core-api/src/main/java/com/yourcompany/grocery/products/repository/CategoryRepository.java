package com.yourcompany.grocery.products.repository;

import com.yourcompany.grocery.products.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {
    Optional<Category> findBySlug(String slug);
    boolean existsBySlug(String slug);

    @Query("SELECT c FROM Category c WHERE c.active = true ORDER BY c.sortOrder ASC, c.name ASC")
    List<Category> findAllActiveCategories();
}
