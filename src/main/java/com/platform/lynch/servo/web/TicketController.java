package com.platform.lynch.servo.web;

import com.platform.lynch.servo.model.Business;
import com.platform.lynch.servo.model.Group;
import com.platform.lynch.servo.model.GroupRepository;
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
    Collection<?> getAll(@RequestHeader(value="UserId") String userId, Ticket.TicketStatus status) {
    	
    	log.info("Request to get all tickets: {}", userId);
    	
    	List<Ticket.PublicTicket> response = new ArrayList<>();
    	Optional<Business> user = businessRepository.findById(userId);
    	
    	if (!user.isPresent())
    		return response;
    	
    	
    	List<Ticket> foundTickets = ticketRepository.findAllByMenuItemBusiness(user.get());//ticketRepository.findAllByMenuItemBusinessInAndStatusIn(user.get(), status);
    	
    	for (Ticket ticket: foundTickets)
    		response.add(ticket.getPublicEntity());
    	
        return response;
    }
    
    @GetMapping("/ticket/open")
    Collection<?> getAllOpen(@RequestHeader(value="UserId") String userId) { return getAll(userId, Ticket.TicketStatus.OPEN); }
    
    @GetMapping("/ticket/complete")
    Collection<?> getAllComplete(@RequestHeader(value="UserId") String userId) { return getAll(userId, Ticket.TicketStatus.COMPLETE); }
    
    @GetMapping("/ticket/incomplete")
    Collection<?> getAllIncomplete(@RequestHeader(value="UserId") String userId) { return getAll(userId, Ticket.TicketStatus.INCOMPLETE); }

    @GetMapping("/ticket/{id}")
    ResponseEntity<?> get(@PathVariable String id) {

    	log.info("Request to get ticket: {}", id);
    	
    	Optional<Ticket> ticket = ticketRepository.findById(Long.parseLong(id));
    	
        return ticket.map(response -> ResponseEntity.ok().body(response.getPublicEntity()))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping(value={"/ticket", "/ticket/open", "/ticket/complete", "/ticket/incomplete"})
    ResponseEntity<?> create(@RequestHeader(value="UserId") String userId,
    							@Valid @RequestBody Ticket.PublicTicket ticket) throws URISyntaxException {
    	
    	log.info("Request to create ticket: {}", ticket);
    	
    	Optional<MenuItem> menuItem = menuRepository.findById(ticket.getId());
    	Optional<Customer> customer = customerRepository.findById(ticket.getCustomerId());
    	
    	if (!menuItem.isPresent() || !customer.isPresent()) 
    		return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    	
    	Ticket result = new Ticket();
    	result.setCustomer(customer.get());
    	result.setMenuItem(menuItem.get());
    	result.setQuantity(ticket.getQuantity());
    	result.setOptions(ticket.getOptions());
    	result.setTimestamp(ticket.getTimestamp());
    	result.setStatus(ticket.getStatus());
    	
        result = ticketRepository.save(result);
        
        return ResponseEntity.ok().body(result);
    }

    @PutMapping(value={"/ticket/{id}", "/ticket/open/{id}", "/ticket/complete/{id}", "/ticket/incomplete/{id}"})
    ResponseEntity<?> update(@PathVariable Long id,
    							@RequestHeader(value="UserId") String userId,
    							@Valid @RequestBody Ticket.PublicTicket ticket) {
    	
    	log.info("Request to update ticket: {}", ticket);
    	
    	Optional<Ticket> existing = ticketRepository.findById(id);
    	Optional<MenuItem> menuItem = menuRepository.findById(ticket.getId());
    	Optional<Customer> customer = customerRepository.findById(ticket.getCustomerId());
    	
    	if (!menuItem.isPresent() || !customer.isPresent()) 
    		return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    	
    	if (!existing.isPresent()) 
    		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    	
    	Ticket result = new Ticket();
    	result.setCustomer(customer.get());
    	result.setMenuItem(menuItem.get());
    	result.setQuantity(ticket.getQuantity());
    	result.setOptions(ticket.getOptions());
    	result.setTimestamp(ticket.getTimestamp());
    	result.setStatus(ticket.getStatus());
    	
        return ResponseEntity.ok().body(ticketRepository.save(result));
        
    }

    @DeleteMapping(value={"/ticket/{id}", "/ticket/open/{id}", "/ticket/complete/{id}", "/ticket/incomplete/{id}"})
    public ResponseEntity<?> delete(@PathVariable Long id,
										@RequestHeader(value="UserId") String userId) {
    	
    	log.info("Request to delete ticket: {}", id);
    	
    	Optional<Ticket> existing = ticketRepository.findById(id);
    	
    	if (!existing.isPresent()) 
    		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    	
    	ticketRepository.deleteById(id);
    	
        return ResponseEntity.ok().build();
    	
    }
}