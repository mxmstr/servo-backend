package com.platform.lynch.servo.web;

import com.platform.lynch.servo.model.Business;
import com.platform.lynch.servo.model.MenuItem;
import com.platform.lynch.servo.model.MenuRepository;
import com.platform.lynch.servo.model.Ticket;
import com.platform.lynch.servo.model.TicketRepository;
import com.platform.lynch.servo.model.BusinessRepository;
import com.platform.lynch.servo.model.Customer;
import com.platform.lynch.servo.model.CustomerRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
class TicketController {

    private final Logger log = LoggerFactory.getLogger(TicketController.class);
    private TicketRepository ticketRepository;
    private BusinessRepository businessRepository;
    private CustomerRepository customerRepository;
    private MenuRepository menuRepository;

    public TicketController(TicketRepository ticketRepository, BusinessRepository businessRepository, CustomerRepository customerRepository, MenuRepository menuRepository) {
        this.ticketRepository = ticketRepository;
        this.businessRepository = businessRepository;
        this.customerRepository = customerRepository;
        this.menuRepository = menuRepository;
    }
    
    @GetMapping("/ticket")
    Collection<?> getAll(@RequestHeader(value="UserId") String userId) {
    	
    	log.info("Request to get all tickets: {}", userId);
    	
    	List<Ticket.PublicTicket> response = new ArrayList<>();
    	List<Ticket> foundTickets = new ArrayList<>();
    	Optional<Business> business = businessRepository.findById(userId);
    	Optional<Customer> customer = customerRepository.findById(userId);

    	// Check whether user id belongs to a business or customer. Return tickets accordingly.
    	if (business.isPresent())
    		foundTickets = ticketRepository.findAllByMenuItemBusiness(business.get());
    	else if (customer.isPresent())
    		foundTickets = ticketRepository.findAllByCustomer(customer.get());
    	

    	for (Ticket ticket: foundTickets)
    		response.add(ticket.getPublicEntity());
    	
    	
    	// Sort the tickets to show the most recent first
    	Collections.sort(response, new Comparator<Ticket.PublicTicket>() {
    	    public int compare(Ticket.PublicTicket a, Ticket.PublicTicket b) {
    	        return b.getTimestamp().compareTo(a.getTimestamp());
    	    }
    	});
    	
        return response;
    }
    
    @GetMapping("/ticket/{id}")
    ResponseEntity<?> get(@PathVariable String id) {

    	log.info("Request to get ticket: {}", id);
    	
    	Optional<Ticket> ticket = ticketRepository.findById(Long.parseLong(id));
    	
        return ticket.map(response -> ResponseEntity.ok().body(response.getPublicEntity()))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/ticket")
    ResponseEntity<?> create(@RequestHeader(value="UserId") String userId,
    							@Valid @RequestBody Ticket.PublicTicket ticket) throws URISyntaxException {
    	
    	log.info("Request to create ticket: {}", ticket);

    	// Check that the menu item and customer actually exist
    	Optional<MenuItem> menuItem = menuRepository.findById(ticket.getItemId());
    	Optional<Customer> customer = customerRepository.findById(ticket.getCustomerId());
    	
    	if (!menuItem.isPresent() || !customer.isPresent()) 
    		return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    	
    	// Save the ticket
    	Ticket result = new Ticket();
    	result.setCustomer(customer.get());
    	result.setMenuItem(menuItem.get());
    	result.setQuantity(ticket.getQuantity());
    	result.setOptions(ticket.getOptions());
    	result.setTimestamp(new Date());
    	result.setStatus(ticket.getStatus());
    	
        result = ticketRepository.save(result);
        
        return ResponseEntity.ok().body(result);
    }

    @PutMapping("/ticket/{id}")
    ResponseEntity<?> update(@PathVariable Long id,
    							@RequestHeader(value="UserId") String userId,
    							@Valid @RequestBody Ticket.PublicTicket ticket) {
    	
    	log.info("Request to update ticket: {}", ticket);
    	
    	// Check that the ticket actually exists
    	// Check that the menu item and customer actually exist
    	Optional<Ticket> existing = ticketRepository.findById(id);
    	Optional<MenuItem> menuItem = menuRepository.findById(ticket.getItemId());
    	Optional<Customer> customer = customerRepository.findById(ticket.getCustomerId());
    	
    	if (!menuItem.isPresent() || !customer.isPresent()) 
    		return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    	
    	if (!existing.isPresent()) 
    		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    	
    	
    	// Save the ticket
    	Ticket result = existing.get();
    	result.setCustomer(customer.get());
    	result.setMenuItem(menuItem.get());
    	result.setQuantity(ticket.getQuantity());
    	result.setOptions(ticket.getOptions());
    	result.setTimestamp(ticket.getTimestamp());
    	result.setStatus(ticket.getStatus());
    	
        return ResponseEntity.ok().body(ticketRepository.save(result));
        
    }

    @DeleteMapping("/ticket/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id,
										@RequestHeader(value="UserId") String userId) {
    	
    	log.info("Request to delete ticket: {}", id);

    	// Check that the ticket actually exists
    	Optional<Ticket> existing = ticketRepository.findById(id);
    	
    	if (!existing.isPresent()) 
    		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    	
    	// Delete the ticket
    	ticketRepository.deleteById(id);
    	
        return ResponseEntity.ok().build();
    	
    }
}