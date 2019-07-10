package com.platform.lynch.servo.web;

import com.platform.lynch.servo.model.Business;
import com.platform.lynch.servo.model.Group;
import com.platform.lynch.servo.model.GroupRepository;
import com.platform.lynch.servo.model.MenuItem;
import com.platform.lynch.servo.model.MenuRepository;
import com.platform.lynch.servo.model.UserRepository;

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
class MenuController {

    private final Logger log = LoggerFactory.getLogger(MenuController.class);
    private MenuRepository menuRepository;
    private UserRepository userRepository;

    public MenuController(MenuRepository menuRepository, UserRepository userRepository) {
        this.menuRepository = menuRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/menu")
    Collection<?> menuitems(@RequestHeader(value="UserId") String userId) {
    	log.info("Request to get all menu items: {}", userId);
    	
    	List<MenuItem.PublicMenuItem> response = new ArrayList<>();
    	
    	for (MenuItem menuItem: menuRepository.findAllByBusinessId(userId)) {
    		response.add(menuItem.getPublicEntity());
    	}
    	
        return response;
    }

    @GetMapping("/menu/{id}")
    ResponseEntity<?> get(@PathVariable String id) {
    	
    	Optional<MenuItem> menuItem = menuRepository.findById(Long.parseLong(id));
    	
        return menuItem.map(response -> ResponseEntity.ok().body(response.getPublicEntity()))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping("/menu")
    ResponseEntity<?> create(@RequestHeader(value="UserId") String userId,
    							@Valid @RequestBody MenuItem.PublicMenuItem menuItem) throws URISyntaxException {
    	
    	log.info("Request to create menuitem: {}", menuItem);

        // check to see if item already exists
    	Optional<MenuItem> existing = menuRepository.findById(menuItem.getId());

    	if (existing.isPresent()) 
    		return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    	
    	
    	Optional<Business> user = userRepository.findById(userId);
    	
    	if (!user.isPresent()) 
    		return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    	
    	
    	MenuItem result = new MenuItem(
    			0L,
    			user.get(),
    			menuItem.getName(),
    			menuItem.getPrice(),
    			menuItem.getOptions(),
    			menuItem.getImage()
    			);
    	
        result = menuRepository.save(result);
        
        return ResponseEntity.ok().body(result);
    }

    @PutMapping("/menu/{id}")
    ResponseEntity<?> update(@PathVariable Long id,
    							@RequestHeader(value="UserId") String userId,
    							@Valid @RequestBody MenuItem.PublicMenuItem menuItem) {
    	
    	log.info("Request to update menu: {}", menuItem);
    	
    	Optional<MenuItem> existing = menuRepository.findById(id);
    	
    	if (!existing.isPresent()) 
    		return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    	
    	MenuItem result = existing.get();
    	result.setName(menuItem.getName());
    	result.setPrice(menuItem.getPrice());
    	result.setOptions(menuItem.getOptions());
    	result.setImage(menuItem.getImage());
    	
        return ResponseEntity.ok().body(menuRepository.save(result));
        
    }

    @DeleteMapping("/menu/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
    	return null;
    }
}