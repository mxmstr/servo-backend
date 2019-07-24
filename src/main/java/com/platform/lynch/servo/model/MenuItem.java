package com.platform.lynch.servo.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
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
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(cascade=CascadeType.PERSIST)
    private Business business;
    private String name;
    private String price;
    private String options;
    @Lob
    private byte[] image;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PublicMenuItem {

        private byte[] image;
        private Long id;
        private String name;
        private String price;
        private String options;
    	
    }
    
    public PublicMenuItem getPublicEntity() {
    	
    	return new PublicMenuItem(image, id, name, price, options);
    	
    }
    
}
