package com.platform.lynch.servo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;

import com.platform.lynch.servo.model.Ticket.PublicTicket;
import com.platform.lynch.servo.model.Ticket.TicketStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ServoTable {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private Business business;
    @ManyToOne
    private Customer customer;
    private double[] position = {0, 0};
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PublicTable {
    	
        private Long id;
        private String businessId;
        private String customerId;
        private double[] position = {0, 0};
    	
    }
    
    public PublicTable getPublicEntity() {
    	
    	return new PublicTable(id, business == null ? "" : business.getId(), customer == null ? "" : customer.getId(), position);
    	
    }
    
}
