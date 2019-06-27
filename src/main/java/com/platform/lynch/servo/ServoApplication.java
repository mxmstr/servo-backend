package com.platform.lynch.servo;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.savedrequest.HttpSessionRequestCache;
import org.springframework.security.web.savedrequest.RequestCache;
import org.springframework.security.web.savedrequest.SimpleSavedRequest;

@SpringBootApplication
public class ServoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServoApplication.class, args);
	}
	
	@Configuration
    static class OktaOAuth2WebSecurityConfigurerAdapter extends WebSecurityConfigurerAdapter {

        @Override
        protected void configure(HttpSecurity http) throws Exception {
        	http
	            .oauth2Login().and()
	            .csrf()
	                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
	                .and()
	            .authorizeRequests()
	                .antMatchers("/**/*.{js,html,css}").permitAll()
	                .antMatchers("/", "/api/user").permitAll()
	                .anyRequest().authenticated();
//            http
//                .authorizeRequests().anyRequest().authenticated()
//                .and()
//                .oauth2ResourceServer().jwt();
        }
    }
	
	@Bean
    //@Profile("dev")
    public RequestCache refererRequestCache() {
	    return new HttpSessionRequestCache() {
	        @Override
	        public void saveRequest(HttpServletRequest request, HttpServletResponse response) {
	            String referrer = request.getHeader("referer");
	            if (referrer != null) {
	                request.getSession().setAttribute("SPRING_SECURITY_SAVED_REQUEST", new SimpleSavedRequest(referrer));
	            }
	        }
	    };
	}
	
}
