package com.chatapp.mainapp.Exceptions;

import java.time.LocalDateTime;

public class ErrorDetail {
    String error;
    String message;
    LocalDateTime timestamp;

    

    public ErrorDetail() {
    
    }



    public ErrorDetail(String error, String message, LocalDateTime timestamp) {
        super();
        this.error = error;
        this.message = message;
        this.timestamp = timestamp;
    }

    
}
