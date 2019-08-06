package com.platform.lynch.servo.web;

import java.io.IOException;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.platform.lynch.servo.model.Business;
import com.platform.lynch.servo.model.GenericUser;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class UserControllerTest {

    @Test
    public void testRegisterBusiness() throws IOException {
    	
    	GenericUser user = new GenericUser();
    	user.setEmail("business@email.com");
    	user.setPassword("password");
    	
    	
    	TestRestTemplate restTemplate = new TestRestTemplate();
        ResponseEntity<?> response = restTemplate.postForEntity("http://localhost:8080/api/business", user, GenericUser.class);

        Assert.assertTrue(response.getStatusCode().toString(), response.getStatusCode().equals(HttpStatus.OK));

        
//        ObjectMapper objectMapper = new ObjectMapper();
//        JsonNode responseJson = objectMapper.readTree(response.getBody());
//
//        System.out.println(responseJson.asText());
//        Assert.assertFalse(responseJson.isMissingNode());
//        Assert.assertTrue(responseJson.toString().equals("[]"));
        
    }
    
    @Test
    public void testRegisterCustomer() throws IOException {
    	
    	GenericUser user = new GenericUser();
    	user.setEmail("customer@email.com");
    	user.setPassword("password");
    	
    	
    	TestRestTemplate restTemplate = new TestRestTemplate();
        ResponseEntity<?> response = restTemplate.postForEntity("http://localhost:8080/api/customer", user, GenericUser.class);

        Assert.assertTrue(response.getStatusCode().toString(), response.getStatusCode().equals(HttpStatus.OK));
        
    }
}