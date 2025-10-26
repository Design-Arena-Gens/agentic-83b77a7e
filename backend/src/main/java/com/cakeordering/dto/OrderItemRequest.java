package com.cakeordering.dto;

import lombok.Data;

@Data
public class OrderItemRequest {
    private Long cakeId;
    private Integer quantity;
    private String customMessage;
    private String customDesignUrl;
}
