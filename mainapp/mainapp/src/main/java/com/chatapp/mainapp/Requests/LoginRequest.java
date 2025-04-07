package com.chatapp.mainapp.Requests;

import lombok.Data;

@Data
public class LoginRequest {
    String email;
    String password;

    public LoginRequest(String email, String password) {
        super();
        this.email = email;
        this.password = password;
    }
}
