package com.chatapp.mainapp.Requests;

import lombok.Data;

@Data
public class SingleChatRequest {
    private Integer userId;

    public SingleChatRequest() {
    }

    public SingleChatRequest(Integer userId) {
        super();
        this.userId = userId;
    }

    
}
