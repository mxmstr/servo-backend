package com.platform.lynch.servo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Customer {

    @Id
    private String id;
    private String name;
    private String address;
    private Boolean isOpened;
    @Lob
    private byte[] images;
    private String email;
    private String password;
    
}
