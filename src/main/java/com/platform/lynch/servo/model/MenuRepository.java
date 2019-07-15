package com.platform.lynch.servo.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MenuRepository extends JpaRepository<MenuItem, Long> {

	Optional<MenuItem> findById(Long id);
	
	List<MenuItem> findAllByBusinessId(String id);
    
}