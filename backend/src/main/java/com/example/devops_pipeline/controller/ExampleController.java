package com.example.devops_pipeline.controller;

import com.example.devops_pipeline.dto.ApiResponse;
import com.example.devops_pipeline.dto.ExampleRequest;
import com.example.devops_pipeline.entity.Example;
import com.example.devops_pipeline.service.ExampleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/examples")
@RequiredArgsConstructor
public class ExampleController {

    private final ExampleService exampleService;

    // GET /api/examples - Get all examples
    @GetMapping
    public ResponseEntity<ApiResponse<List<Example>>> getAllExamples() {
        List<Example> examples = exampleService.getAllExamples();
        return ResponseEntity.ok(ApiResponse.success("Examples retrieved successfully", examples));
    }

    // GET /api/examples/{id} - Get example by ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Example>> getExampleById(@PathVariable Long id) {
        Example example = exampleService.getExampleById(id);
        return ResponseEntity.ok(ApiResponse.success("Example retrieved successfully", example));
    }

    // GET /api/examples/search?name=xxx - Search examples by name
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Example>>> searchExamples(@RequestParam String name) {
        List<Example> examples = exampleService.searchExamples(name);
        return ResponseEntity.ok(ApiResponse.success("Search results", examples));
    }

    // POST /api/examples - Create new example
    @PostMapping
    public ResponseEntity<ApiResponse<Example>> createExample(@Valid @RequestBody ExampleRequest request) {
        Example example = exampleService.createExample(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Example created successfully", example));
    }

    // PUT /api/examples/{id} - Update example
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Example>> updateExample(
            @PathVariable Long id,
            @Valid @RequestBody ExampleRequest request) {
        Example example = exampleService.updateExample(id, request);
        return ResponseEntity.ok(ApiResponse.success("Example updated successfully", example));
    }

    // DELETE /api/examples/{id} - Delete example
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExample(@PathVariable Long id) {
        exampleService.deleteExample(id);
        return ResponseEntity.ok(ApiResponse.success("Example deleted successfully", null));
    }
}
