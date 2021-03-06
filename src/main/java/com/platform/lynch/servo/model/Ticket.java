package com.platform.lynch.servo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import com.platform.lynch.servo.model.MenuItem.PublicMenuItem;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Ticket {

	public enum TicketStatus {
		OPEN, COMPLETE, INCOMPLETE
	}
	
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    private Customer customer;
    @OneToOne
    private MenuItem menuItem;
    private int quantity;
    private String options;
    private Date timestamp;
    @Enumerated(EnumType.STRING)
    private TicketStatus status;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PublicTicket {
    	
        private Long id;
        private String customerId;
        private Long itemId;
        private String itemName;
        private int quantity;
        private String options;
        private Date timestamp;
        private TicketStatus status;
    	
    }
    
    public PublicTicket getPublicEntity() {
    	
    	return new PublicTicket(id, customer == null ? "" : customer.getId(), menuItem == null ? 0L : menuItem.getId(),  menuItem == null ? "" : menuItem.getName(), quantity, options, timestamp, status);
    	
    }
    
}
