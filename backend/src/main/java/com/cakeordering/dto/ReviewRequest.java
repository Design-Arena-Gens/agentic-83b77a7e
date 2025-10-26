package com.cakeordering.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long cakeId;
    private Integer rating;
    private String comment;
}
