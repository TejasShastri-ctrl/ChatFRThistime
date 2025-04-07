package com.chatapp.mainapp.Controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.chatapp.mainapp.Models.Message;

public class RealTimeChat {
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/message")
    @SendTo("/group/public") //broadcast to all subscribed users
    public Message recieveMessage(@Payload Message message) {
        simpMessagingTemplate.convertAndSend("/group/" + message.getChat().getId().toString(), message);
        return message;
    }
}