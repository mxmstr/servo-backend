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
import com.platform.lynch.servo.model.ServoTable;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class TableControllerTest {

	final String url = "http://localhost:8080/api/table/";
	final String userId = "00uoudimbcBaMgXYj356";
	final String customerId = "00uyza6nwAy2X8Tmr356";
	
	static TestRestTemplate restTemplate;
	
	public TableControllerTest() {
		
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
    	
    	ServoTable.PublicTable table = new ServoTable.PublicTable();
    	table.setBusinessId(userId);
    	
    	
    	// Create
    	ResponseEntity<?> response = restTemplate.exchange(url, HttpMethod.POST, new HttpEntity<Object>(table), ServoTable.PublicTable.class);

        Assert.assertTrue(response.getStatusCode().toString(), response.getStatusCode().equals(HttpStatus.OK));

        
        // Update
        table = (ServoTable.PublicTable) response.getBody();
        table.setBusinessId(userId);
        table.setCustomerId(customerId);
       
        response = restTemplate.exchange(url + table.getId().toString(), HttpMethod.PUT, new HttpEntity<Object>(table), ServoTable.PublicTable.class);
        
        Assert.assertTrue(response.getStatusCode().toString(), response.getStatusCode().equals(HttpStatus.OK));
        
        
        // Delete
        response = restTemplate.exchange(url + table.getId().toString(), HttpMethod.DELETE, null, ServoTable.PublicTable.class);
        
        Assert.assertTrue(response.getStatusCode().toString(), response.getStatusCode().equals(HttpStatus.OK));
    }
    
}