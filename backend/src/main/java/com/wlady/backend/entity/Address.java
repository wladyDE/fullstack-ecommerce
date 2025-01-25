package com.wlady.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    private String street;
    private String city;
    private String state;
    private String country;
    private String zipCode;
    @OneToOne
    @PrimaryKeyJoinColumn
    private Order oder;
}
