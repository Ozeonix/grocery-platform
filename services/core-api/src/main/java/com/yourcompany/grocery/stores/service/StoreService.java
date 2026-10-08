package com.yourcompany.grocery.stores.service;

import com.yourcompany.grocery.common.exception.ConflictException;
import com.yourcompany.grocery.common.exception.ResourceNotFoundException;
import com.yourcompany.grocery.stores.dto.CreateStoreRequest;
import com.yourcompany.grocery.stores.dto.StoreDto;
import com.yourcompany.grocery.stores.dto.UpdateStoreRequest;
import com.yourcompany.grocery.stores.entity.Store;
import com.yourcompany.grocery.stores.entity.StoreUser;
import com.yourcompany.grocery.stores.repository.StoreRepository;
import com.yourcompany.grocery.stores.repository.StoreUserRepository;
import com.yourcompany.grocery.users.entity.User;
import com.yourcompany.grocery.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreRepository storeRepository;
    private final StoreUserRepository storeUserRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<StoreDto> getAllActiveStores() {
        return storeRepository.findAllActiveStores().stream()
                .map(StoreDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StoreDto getStoreById(UUID id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store", "id", id));
        return StoreDto.fromEntity(store);
    }

    @Transactional(readOnly = true)
    public StoreDto getStoreBySlug(String slug) {
        Store store = storeRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Store", "slug", slug));
        return StoreDto.fromEntity(store);
    }

    @Transactional
    public StoreDto createStore(UUID ownerId, CreateStoreRequest request) {
        if (storeRepository.existsBySlug(request.getSlug())) {
            throw new ConflictException("Store with slug '" + request.getSlug() + "' already exists");
        }

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", ownerId));

        Store store = Store.builder()
                .name(request.getName().trim())
                .slug(request.getSlug().trim().toLowerCase())
                .description(request.getDescription())
                .phone(request.getPhone())
                .email(request.getEmail())
                .logoUrl(request.getLogoUrl())
                .bannerUrl(request.getBannerUrl())
                .addressLine1(request.getAddressLine1())
                .addressLine2(request.getAddressLine2())
                .city(request.getCity())
                .state(request.getState())
                .postalCode(request.getPostalCode())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .status("ACTIVE")
                .acceptingOrders(true)
                .openingTime(request.getOpeningTime())
                .closingTime(request.getClosingTime())
                .build();

        Store savedStore = storeRepository.save(store);

        StoreUser storeUser = StoreUser.builder()
                .store(savedStore)
                .user(owner)
                .role("OWNER")
                .build();
        storeUserRepository.save(storeUser);

        return StoreDto.fromEntity(savedStore);
    }

    @Transactional
    public StoreDto updateStore(UUID storeId, UpdateStoreRequest request) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store", "id", storeId));

        if (StringUtils.hasText(request.getName())) store.setName(request.getName().trim());
        if (request.getDescription() != null) store.setDescription(request.getDescription());
        if (request.getPhone() != null) store.setPhone(request.getPhone());
        if (request.getEmail() != null) store.setEmail(request.getEmail());
        if (request.getLogoUrl() != null) store.setLogoUrl(request.getLogoUrl());
        if (request.getBannerUrl() != null) store.setBannerUrl(request.getBannerUrl());
        if (StringUtils.hasText(request.getAddressLine1())) store.setAddressLine1(request.getAddressLine1());
        if (request.getAddressLine2() != null) store.setAddressLine2(request.getAddressLine2());
        if (StringUtils.hasText(request.getCity())) store.setCity(request.getCity());
        if (StringUtils.hasText(request.getState())) store.setState(request.getState());
        if (StringUtils.hasText(request.getPostalCode())) store.setPostalCode(request.getPostalCode());
        if (request.getLatitude() != null) store.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) store.setLongitude(request.getLongitude());
        if (request.getStatus() != null) store.setStatus(request.getStatus());
        if (request.getAcceptingOrders() != null) store.setAcceptingOrders(request.getAcceptingOrders());
        if (request.getOpeningTime() != null) store.setOpeningTime(request.getOpeningTime());
        if (request.getClosingTime() != null) store.setClosingTime(request.getClosingTime());

        Store updated = storeRepository.save(store);
        return StoreDto.fromEntity(updated);
    }
}
