package com.example.devops_pipeline.repository;

import com.example.devops_pipeline.entity.Example;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExampleRepository extends JpaRepository<Example, Long> {

    List<Example> findByNameContainingIgnoreCase(String name);
}
