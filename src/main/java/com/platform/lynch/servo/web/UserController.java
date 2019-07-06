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
import com.okta.sdk.resource.user.UserBuilder;
import com.platform.lynch.servo.model.Group;
import com.platform.lynch.servo.model.GroupRepository;
import com.platform.lynch.servo.model.User;
import com.platform.lynch.servo.model.Business;
import com.platform.lynch.servo.model.UserRepository;

import lombok.Value;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Properties;

@RestController
@RequestMapping("/api")
public class UserController {
	
	@Autowired
	private Environment environment;
	
	private final Logger log = LoggerFactory.getLogger(UserController.class);
    private GroupRepository groupRepository;
    private UserRepository userRepository;
    private ClientRegistration registration;

    public UserController(GroupRepository groupRepository, 
    		UserRepository userRepository, 
    		ClientRegistrationRepository registrations) {
        this.groupRepository = groupRepository;
        this.userRepository = userRepository;
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
    
    @PostMapping("/user")
    ResponseEntity<?> createUser(@Valid @RequestBody User user) throws URISyntaxException {
    	
        log.info("Request to create user: {}", user);
        
        Client client = Clients.builder()
        		.setOrgUrl(environment.getProperty("spring.user.oauth.orgUrl"))
        		.setClientCredentials(new TokenClientCredentials(environment.getProperty("spring.user.oauth.token")))
        		.build();
        
        try {
        	UserBuilder.instance()
	        	.setEmail(user.getEmail())
	        	.setFirstName(user.getName())
	        	.setPassword(user.getPassword().toCharArray())
	        	.setActive(true)
	        	.buildAndCreate(client);
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
