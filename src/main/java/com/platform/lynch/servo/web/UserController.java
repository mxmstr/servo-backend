package com.platform.lynch.servo.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.oidc.OidcIdToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.okta.sdk.authc.credentials.TokenClientCredentials;
import com.okta.sdk.client.Client;
import com.okta.sdk.client.Clients;
import com.okta.sdk.resource.ResourceException;
import com.okta.sdk.resource.user.User;
import com.okta.sdk.resource.user.UserBuilder;
import com.okta.sdk.resource.user.UserCredentials;
import com.platform.lynch.servo.model.GenericUser;
import com.platform.lynch.servo.model.Business;
import com.platform.lynch.servo.model.BusinessRepository;
import com.platform.lynch.servo.model.Customer;
import com.platform.lynch.servo.model.CustomerRepository;

import lombok.Value;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;
import java.util.Set;

@RestController
@RequestMapping("/api")
public class UserController {
	
	@Autowired
	private Environment environment;
	
	private final Logger log = LoggerFactory.getLogger(UserController.class);
    private BusinessRepository businessRepository;
    private CustomerRepository customerRepository;
    private ClientRegistration registration;

    public UserController(BusinessRepository businessRepository, 
    		CustomerRepository customerRepository, 
    		ClientRegistrationRepository registrations) {
        this.businessRepository = businessRepository;
        this.customerRepository = customerRepository;
        this.registration = registrations.findByRegistrationId("okta");
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUser(@AuthenticationPrincipal OAuth2User user) {
    	
    	log.info("Request to get users: {}", user);
    	
        if (user == null) {
            return new ResponseEntity<>("", HttpStatus.OK);
        } else {
            return ResponseEntity.ok().body(user.getAttributes());
        }
    }
    
    @PostMapping("/business")
    ResponseEntity<?> createBusiness(@Valid @RequestBody GenericUser user) throws URISyntaxException {
    	
        log.info("Request to create user: {}", user);
        
        
        Client client = Clients.builder()
        		.setOrgUrl(environment.getProperty("spring.user.oauth.orgUrl"))
        		.setClientCredentials(new TokenClientCredentials(environment.getProperty("spring.user.oauth.token")))
        		.build();
        
        try {
        	User oktaUser = UserBuilder.instance()
        		.setGroups(new HashSet<String>(Arrays.asList(environment.getProperty("spring.user.group.business"))))
	        	.setEmail(user.getEmail())
	        	.setPassword(user.getPassword().toCharArray())
	        	.setActive(true)
	        	.buildAndCreate(client);
        	
        	Business result = new Business();
            result.setId(oktaUser.getId());
            result.setName(user.getName());
            
            businessRepository.save(result);
        	
        	return ResponseEntity.ok().build();
        }
        catch(ResourceException e) {
        	return ResponseEntity.badRequest().build();
        }
        
    }
    
    @PostMapping("/customer")
    ResponseEntity<?> createCustomer(@Valid @RequestBody GenericUser user) throws URISyntaxException {
    	
        log.info("Request to create user: {}", user);
        
        
        Client client = Clients.builder()
        		.setOrgUrl(environment.getProperty("spring.user.oauth.orgUrl"))
        		.setClientCredentials(new TokenClientCredentials(environment.getProperty("spring.user.oauth.token")))
        		.build();
        
        try {
        	User oktaUser = UserBuilder.instance()
        		.setGroups(new HashSet<String>(Arrays.asList(environment.getProperty("spring.user.group.customer"))))
	        	.setEmail(user.getEmail())
	        	.setPassword(user.getPassword().toCharArray())
	        	.setActive(true)
	        	.buildAndCreate(client);
        	
        	Customer result = new Customer();
            result.setId(oktaUser.getId());
            result.setName(user.getName());
            
            customerRepository.save(result);
        	
        	return ResponseEntity.ok().build();
        }
        catch(ResourceException e) {
        	return ResponseEntity.badRequest().build();
        }
        
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request,
                                    @AuthenticationPrincipal(expression = "idToken") OidcIdToken idToken) {
        // send logout URL to client so they can initiate logout
        String logoutUrl = this.registration.getProviderDetails()
                .getConfigurationMetadata().get("end_session_endpoint").toString();

        Map<String, String> logoutDetails = new HashMap<>();
        logoutDetails.put("logoutUrl", logoutUrl);
        logoutDetails.put("idToken", idToken.getTokenValue());
        request.getSession(false).invalidate();
        return ResponseEntity.ok().body(logoutDetails);
    }
}
