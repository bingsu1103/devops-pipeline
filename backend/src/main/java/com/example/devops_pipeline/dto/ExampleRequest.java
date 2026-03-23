package com.example.devops_pipeline.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExampleRequest {

    @NotBlank(message = "Service name is required")
    private String name;

    private String description;

    @NotNull(message = "Version (Double) is required")
    @Min(value = 0, message = "Version must be >= 0")
    private Double version;

    @NotNull(message = "Build Count (Integer) is required")
    @Min(value = 0, message = "Build Count must be >= 0")
    private Integer buildCount;
}
