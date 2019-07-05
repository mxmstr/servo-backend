package com.platform.lynch.servo.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuRepository extends JpaRepository<MenuItem, Long> {
	
	List<MenuItem> findAllByBusinessId(String id);
    
}