package com.platform.lynch.servo.web;

import com.platform.lynch.servo.model.Business;
import com.platform.lynch.servo.model.MenuItem;
import com.platform.lynch.servo.model.MenuRepository;
import com.platform.lynch.servo.model.ServoTable;
import com.platform.lynch.servo.model.TableRepository;
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
class TableController {

    private final Logger log = LoggerFactory.getLogger(TableController.class);
    private TableRepository tableRepository;
    private BusinessRepository businessRepository;
    private CustomerRepository customerRepository;

    public TableController(TableRepository tableRepository, BusinessRepository businessRepository, CustomerRepository customerRepository) {
        this.tableRepository = tableRepository;
        this.businessRepository = businessRepository;
        this.customerRepository = customerRepository;
    }
    
    @GetMapping("/table")
    Collection<?> getAll(@RequestHeader(value="UserId") String userId) {
    	
    	log.info("Request to get all tables: {}", userId);

    	List<ServoTable> foundTables = new ArrayList<>();
    	Optional<Business> business = businessRepository.findById(userId);
    	Optional<Customer> customer = customerRepository.findById(userId);
    	
    	if (business.isPresent())
    		foundTables = tableRepository.findAllByBusiness(business.get());
    	else if (customer.isPresent())
    		foundTables = tableRepository.findAllByCustomer(customer.get());
    	else
    		return foundTables;
    	
    	
    	List<ServoTable.PublicTable> response = new ArrayList<>();
    	
    	for (ServoTable table: foundTables)
    		response.add(table.getPublicEntity());
    	
        return response;
    }
    
    @GetMapping("/table/{id}")
    ResponseEntity<?> get(@PathVariable String id) {

    	log.info("Request to get table: {}", id);
    	
    	Optional<ServoTable> table = tableRepository.findById(Long.parseLong(id));
    	
        return table.map(response -> ResponseEntity.ok().body(response.getPublicEntity()))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    
    @PostMapping("/table")
    ResponseEntity<?> create(@RequestHeader(value="UserId") String userId,
    							@Valid @RequestBody ServoTable.PublicTable table) throws URISyntaxException {
    	
    	log.info("Request to create table: {}", table);
    	
    	Optional<Business> business = businessRepository.findById(userId);
    	
    	if (!business.isPresent()) 
    		return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    	
    	ServoTable result = new ServoTable();
    	result.setBusiness(business.get());
    	result.setPosition(table.getPosition());
    	
        result = tableRepository.save(result);
        
        return ResponseEntity.ok().body(result);
    }

    @PutMapping("/table/{id}")
    ResponseEntity<?> update(@PathVariable Long id,
    							@Valid @RequestBody ServoTable.PublicTable table) {
    	
    	log.info("Request to update table: {}", table);
    	
    	Optional<ServoTable> existing = tableRepository.findById(id);
    	Optional<Customer> customer = table.getCustomerId() == null ? null : customerRepository.findById(table.getCustomerId());
    	Optional<Business> business = businessRepository.findById(table.getBusinessId());
    	
    	if (!business.isPresent() || (table.getCustomerId() != null && !customer.isPresent())) 
    		return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    	
    	if (!existing.isPresent()) 
    		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    	
    	
    	ServoTable result = existing.get();
    	result.setBusiness(business.get());
    	result.setCustomer(table.getCustomerId() == null ? null : customer.get());
    	result.setPosition(table.getPosition());
    	
        return ResponseEntity.ok().body(tableRepository.save(result));
        
    }

    @DeleteMapping("/table/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id,
										@RequestHeader(value="UserId") String userId) {
    	
    	log.info("Request to delete table: {}", id);
    	
    	Optional<ServoTable> existing = tableRepository.findById(id);
    	
    	if (!existing.isPresent()) 
    		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    	
    	tableRepository.deleteById(id);
    	
        return ResponseEntity.ok().build();
    	
    }
}