package com.platform.lynch.servo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ServoTable {

    @Id
    private String id;
    @ManyToOne
    private Business business;
    @ManyToOne
    private Customer customer;
    
}
