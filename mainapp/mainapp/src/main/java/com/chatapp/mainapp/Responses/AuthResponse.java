package com.chatapp.mainapp.Responses;

public class AuthResponse {
    private String jwt;
    private boolean isAuth;

    public AuthResponse(String jwt, boolean isAuth) {
        this.jwt = jwt;
        this.isAuth = isAuth;
    }

    // Add getters for serialization
    public String getJwt() {
        return jwt;
    }

    public boolean getIsAuth() {
        return isAuth;
    }

    // Optionally, add setters if needed
    public void setJwt(String jwt) {
        this.jwt = jwt;
    }

    public void setIsAuth(boolean isAuth) {
        this.isAuth = isAuth;
    }
}
