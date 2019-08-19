package com.platform.lynch.servo;

import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;


@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {
	
	@Override
    protected void configure(HttpSecurity http) throws Exception {
		
		http
	       .httpBasic().and()
	       .authorizeRequests()
	       .antMatchers(
	    		   "/api/business" , 
	    		   "/api/business/**", 
	    		   "/api/customer" , 
	    		   "/api/customer/**"
	    		   )
	       .permitAll().anyRequest().authenticated()
	       .and().csrf().disable();
		
    }
	
}
