package com.platform.lynch.servo.model;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
	
	List<Ticket> findAllByMenuItemBusinessInAndStatusIn(Business business, Ticket.TicketStatus status);

	List<Ticket> findAllByMenuItemBusiness(Business business);

	List<Ticket> findAllByCustomerId(String userId);

	List<Ticket> findAllByCustomer(Customer customer);
    
}