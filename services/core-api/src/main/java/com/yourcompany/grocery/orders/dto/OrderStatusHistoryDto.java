package com.yourcompany.grocery.orders.dto;

import com.yourcompany.grocery.orders.entity.OrderStatusHistory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderStatusHistoryDto {

    private UUID id;
    private String fromStatus;
    private String toStatus;
    private String reason;
    private String changedByEmail;
    private Instant createdAt;

    public static OrderStatusHistoryDto fromEntity(OrderStatusHistory history) {
        return OrderStatusHistoryDto.builder()
                .id(history.getId())
                .fromStatus(history.getFromStatus())
                .toStatus(history.getToStatus())
                .reason(history.getReason())
                .changedByEmail(history.getChangedBy() != null ? history.getChangedBy().getEmail() : null)
                .createdAt(history.getCreatedAt())
                .build();
    }
}
