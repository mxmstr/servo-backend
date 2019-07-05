package com.platform.lynch.servo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.OneToOne;

import org.hibernate.annotations.Type;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Ticket {

    @Id
    private String id;
    @OneToOne
    private Customer customer;
    @OneToOne
    private MenuItem menuItem;
    private String quantity;
    @ElementCollection
    private List<String> options;
    private String timestamp;
    private String status;
    
}
