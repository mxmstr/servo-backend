package com.platform.lynch.servo.model;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, String> {
	
	Optional<Customer> findById(String id);
	
}