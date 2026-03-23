package com.example.devops_pipeline.service;

import com.example.devops_pipeline.dto.ExampleRequest;
import com.example.devops_pipeline.entity.Example;
import com.example.devops_pipeline.exception.ResourceNotFoundException;
import com.example.devops_pipeline.repository.ExampleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExampleService {

    private final ExampleRepository exampleRepository;

    public List<Example> getAllExamples() {
        return exampleRepository.findAll();
    }

    public Example getExampleById(Long id) {
        return exampleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Example not found with id: " + id));
    }

    public List<Example> searchExamples(String name) {
        return exampleRepository.findByNameContainingIgnoreCase(name);
    }

    public Example createExample(ExampleRequest request) {
        Example example = Example.builder()
                .name(request.getName())
                .description(request.getDescription())
                .version(request.getVersion())
                .buildCount(request.getBuildCount())
                .build();
        return exampleRepository.save(example);
    }

    public Example updateExample(Long id, ExampleRequest request) {
        Example example = getExampleById(id);
        example.setName(request.getName());
        example.setDescription(request.getDescription());
        example.setVersion(request.getVersion());
        example.setBuildCount(request.getBuildCount());
        return exampleRepository.save(example);
    }

    public void deleteExample(Long id) {
        Example example = getExampleById(id);
        exampleRepository.delete(example);
    }
}
