package com.platform.lynch.servo.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TableRepository extends JpaRepository<ServoTable, Long> {
	
	Optional<ServoTable> findById(Long id);
	
	List<ServoTable> findAllByBusiness(Business business);
	List<ServoTable> findAllByCustomer(Customer customer);
    
}