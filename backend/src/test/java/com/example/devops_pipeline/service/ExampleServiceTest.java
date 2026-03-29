package com.example.devops_pipeline.service;

import com.example.devops_pipeline.dto.ExampleRequest;
import com.example.devops_pipeline.entity.Example;
import com.example.devops_pipeline.exception.ResourceNotFoundException;
import com.example.devops_pipeline.repository.ExampleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExampleServiceTest {

    @Mock
    private ExampleRepository exampleRepository;

    @InjectMocks
    private ExampleService exampleService;

    private Example sampleExample;
    private ExampleRequest sampleRequest;

    @BeforeEach
    void setUp() {
        sampleExample = Example.builder()
                .id(1L)
                .name("Test Service")
                .description("Test Description")
                .version(1.0)
                .buildCount(5)
                .build();

        sampleRequest = ExampleRequest.builder()
                .name("Test Service")
                .description("Test Description")
                .version(1.0)
                .buildCount(5)
                .build();
    }

    @Nested
    @DisplayName("Tests for retrieval operations")
    class RetrievalTests {
        @Test
        @DisplayName("Should return all examples")
        void getAllExamples_ShouldReturnList() {
            when(exampleRepository.findAll()).thenReturn(List.of(sampleExample));

            List<Example> result = exampleService.getAllExamples();

            assertThat(result).hasSize(1);
            assertThat(result.get(0).getName()).isEqualTo("Test Service");
            verify(exampleRepository, times(1)).findAll();
        }

        @Test
        @DisplayName("Should return example when ID exists")
        void getExampleById_WithValidId_ShouldReturnExample() {
            when(exampleRepository.findById(1L)).thenReturn(Optional.of(sampleExample));

            Example result = exampleService.getExampleById(1L);

            assertThat(result).isNotNull();
            assertThat(result.getId()).isEqualTo(1L);
        }

        @Test
        @DisplayName("Should throw ResourceNotFoundException when ID does not exist")
        void getExampleById_WithInvalidId_ShouldThrowException() {
            when(exampleRepository.findById(99L)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> exampleService.getExampleById(99L))
                    .isInstanceOf(ResourceNotFoundException.class)
                    .hasMessageContaining("Example not found with id: 99");
        }
        
        @Test
        @DisplayName("Should search examples by name")
        void searchExamples_ShouldReturnFilteredList() {
            when(exampleRepository.findByNameContainingIgnoreCase("Test")).thenReturn(List.of(sampleExample));
            
            List<Example> result = exampleService.searchExamples("Test");
            
            assertThat(result).hasSize(1);
            assertThat(result.get(0).getName()).contains("Test");
        }
    }

    @Nested
    @DisplayName("Tests for mutation operations")
    class MutationTests {
        @Test
        @DisplayName("Should create example successfully")
        void createExample_ShouldReturnSavedExample() {
            when(exampleRepository.save(any(Example.class))).thenReturn(sampleExample);

            Example result = exampleService.createExample(sampleRequest);

            assertThat(result).isNotNull();
            assertThat(result.getName()).isEqualTo(sampleRequest.getName());
            verify(exampleRepository, times(1)).save(any(Example.class));
        }

        @Test
        @DisplayName("Should update example successfully")
        void updateExample_ShouldReturnUpdatedExample() {
            when(exampleRepository.findById(1L)).thenReturn(Optional.of(sampleExample));
            when(exampleRepository.save(any(Example.class))).thenReturn(sampleExample);

            Example result = exampleService.updateExample(1L, sampleRequest);

            assertThat(result).isNotNull();
            verify(exampleRepository, times(1)).save(any(Example.class));
        }

        @Test
        @DisplayName("Should delete example successfully")
        void deleteExample_ShouldInvokeRepositoryDelete() {
            when(exampleRepository.findById(1L)).thenReturn(Optional.of(sampleExample));
            doNothing().when(exampleRepository).delete(any(Example.class));

            exampleService.deleteExample(1L);

            verify(exampleRepository, times(1)).delete(sampleExample);
        }
    }
}
