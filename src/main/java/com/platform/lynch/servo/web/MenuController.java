package com.platform.lynch.servo.web;

import com.platform.lynch.servo.model.Group;
import com.platform.lynch.servo.model.GroupRepository;
import com.platform.lynch.servo.model.MenuItem;
import com.platform.lynch.servo.model.MenuRepository;

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
import java.util.Collection;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
class MenuController {

    private final Logger log = LoggerFactory.getLogger(MenuController.class);
    private MenuRepository menuRepository;

    public MenuController(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    @GetMapping("/menu")
    Collection<MenuItem> menuitems(@AuthenticationPrincipal OAuth2User user) {
    	log.info("Request to get all menu items: {}", user.getName());
    	
        return menuRepository.findAllByBusinessId(user.getName());
    }

    @GetMapping("/menu/{id}")
    Collection<MenuItem> get(@PathVariable String id) {
    	return menuRepository.findAllByBusinessId(id);
    }

    @PostMapping("/menu")
    ResponseEntity<MenuItem> create(@Valid @RequestBody MenuItem menuItem,
                                      @AuthenticationPrincipal OAuth2User principal) throws URISyntaxException {
    	return null;
    }

    @PutMapping("/menu/{id}")
    ResponseEntity<MenuItem> update(@Valid @RequestBody MenuItem menuItem) {
    	return null;
    }

    @DeleteMapping("/menu/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
    	return null;
    }
}