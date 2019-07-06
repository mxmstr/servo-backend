package com.platform.lynch.servo.model;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Business, String> {
	
	Optional<Business> findById(String id);
	
}