package com.platform.lynch.servo.model;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GroupRepository extends JpaRepository<Group, Long> {
	
    List<Group> findAllByName(String name);
    Group findByAddress(String address);
    
    List<Group> findAllByUserId(String id);
    
}