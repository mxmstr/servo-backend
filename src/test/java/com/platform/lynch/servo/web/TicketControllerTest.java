package com.platform.lynch.servo.web;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.lynch.servo.model.Business;
import com.platform.lynch.servo.model.GenericUser;
import com.platform.lynch.servo.model.MenuItem;
import com.platform.lynch.servo.model.Ticket;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class TicketControllerTest {

	final String url = "http://localhost:8080/api/ticket/";
	final String userId = "00uoudimbcBaMgXYj356";
	final String customerId = "00uyza6nwAy2X8Tmr356";
	final Long menuItemId = 1L;
	
	static TestRestTemplate restTemplate;
	
	public TicketControllerTest() {
		
		restTemplate = new TestRestTemplate();
    	restTemplate.getRestTemplate().setInterceptors(
	        Collections.singletonList((request, body, execution) -> {
	            request.getHeaders()
	            	.add("UserId", userId);
	            return execution.execute(request, body);
	        }));
    	
	}
	
    @Test
    public void testGetAll() throws IOException {
    	
    	Collection response = restTemplate.getForObject(url, Collection.class);
    	
    	Assert.assertFalse(response.isEmpty());
        
    }
    
    @Test
    public void testCreateUpdateDelete() throws IOException {
    	
    	Ticket.PublicTicket ticket = new Ticket.PublicTicket();
    	ticket.setCustomerId(customerId);
    	ticket.setItemId(menuItemId);
    	
    	
    	// Create
    	ResponseEntity<?> response = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<Object>(ticket), Ticket.PublicTicket.class);

        Assert.assertTrue(response.getStatusCode().toString(), response.getStatusCode().equals(HttpStatus.OK));

        
        // Update
        ticket = (Ticket.PublicTicket) response.getBody();
        ticket.setCustomerId(customerId);
    	ticket.setItemId(menuItemId);
       
        response = restTemplate.exchange(url + ticket.getId().toString(), HttpMethod.PUT, new HttpEntity<Object>(ticket), Ticket.PublicTicket.class);
        
        Assert.assertTrue(response.getStatusCode().toString(), response.getStatusCode().equals(HttpStatus.OK));
        
        
        // Delete
        response = restTemplate.exchange(url + ticket.getId().toString(), HttpMethod.DELETE, null, Ticket.PublicTicket.class);
        
        Assert.assertTrue(response.getStatusCode().toString(), response.getStatusCode().equals(HttpStatus.OK));
    }
    
}