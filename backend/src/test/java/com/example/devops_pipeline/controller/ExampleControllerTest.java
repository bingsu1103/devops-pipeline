package com.example.devops_pipeline.controller;

import com.example.devops_pipeline.dto.ExampleRequest;
import com.example.devops_pipeline.entity.Example;
import com.example.devops_pipeline.service.ExampleService;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ExampleControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ExampleService exampleService;

    @InjectMocks
    private ExampleController exampleController;

    private ObjectMapper objectMapper = new ObjectMapper();

    private Example sampleExample;
    private ExampleRequest sampleRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(exampleController).build();

        sampleExample = Example.builder()
                .id(1L)
                .name("Test Service")
                .description("Test Description")
                .version(1.0)
                .buildCount(5)
                .createdAt(LocalDateTime.now())
                .build();

        sampleRequest = ExampleRequest.builder()
                .name("Test Service")
                .description("Test Description")
                .version(1.0)
                .buildCount(5)
                .build();
    }

    @Test
    @DisplayName("GET /api/examples - Should return all examples")
    void getAllExamples_ShouldReturnList() throws Exception {
        when(exampleService.getAllExamples()).thenReturn(List.of(sampleExample));

        mockMvc.perform(get("/api/examples"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].name").value("Test Service"));
    }

    @Test
    @DisplayName("GET /api/examples/{id} - Should return example")
    void getExampleById_WithValidId_ShouldReturnExample() throws Exception {
        when(exampleService.getExampleById(1L)).thenReturn(sampleExample);

        mockMvc.perform(get("/api/examples/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.id").value(1));
    }

    @Test
    @DisplayName("GET /api/examples/search - Should return filtered results")
    void searchExamples_ShouldReturnFilteredList() throws Exception {
        when(exampleService.searchExamples("Test")).thenReturn(List.of(sampleExample));

        mockMvc.perform(get("/api/examples/search").param("name", "Test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").isArray());
    }

    @Test
    @DisplayName("POST /api/examples - Should create example")
    void createExample_WithValidRequest_ShouldReturnCreated() throws Exception {
        when(exampleService.createExample(any(ExampleRequest.class))).thenReturn(sampleExample);

        mockMvc.perform(post("/api/examples")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Example created successfully"));
    }

    @Test
    @DisplayName("PUT /api/examples/{id} - Should update example")
    void updateExample_WithValidRequest_ShouldReturnOk() throws Exception {
        when(exampleService.updateExample(eq(1L), any(ExampleRequest.class))).thenReturn(sampleExample);

        mockMvc.perform(put("/api/examples/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(sampleRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Example updated successfully"));
    }

    @Test
    @DisplayName("DELETE /api/examples/{id} - Should delete example")
    void deleteExample_ShouldReturnOk() throws Exception {
        doNothing().when(exampleService).deleteExample(1L);

        mockMvc.perform(delete("/api/examples/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Example deleted successfully"));
    }
}
