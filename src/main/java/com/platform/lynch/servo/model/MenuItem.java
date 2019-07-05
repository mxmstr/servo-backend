package com.platform.lynch.servo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class MenuItem {

    @Id
    @GeneratedValue
    private Long id;
    @ManyToOne(cascade=CascadeType.PERSIST)
    private Business business;
    private String name;
    private String price;
    private String options;
    @Lob
    private byte[] image;
    
}
