package com.platform.lynch.servo.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TableRepository extends JpaRepository<ServoTable, Long> {
	
	List<ServoTable> findAllByBusinessId(String id);
    
}