package com.chatapp.mainapp.Models;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

@Table(name = "chat_user")

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer id;
    private String full_name;
    private String email;
    private String profile_picture;
    private String password;

    // @OneToMany(mappedBy = "user", cascade = CascadeType.ALL);
    // private List<Notification> notifications = new ArrayList<>();
}
