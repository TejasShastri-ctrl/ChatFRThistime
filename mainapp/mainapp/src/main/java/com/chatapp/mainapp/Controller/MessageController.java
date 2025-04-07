package com.chatapp.mainapp.Controller;

import java.util.*;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.chatapp.mainapp.Exceptions.ChatException;
import com.chatapp.mainapp.Exceptions.MessageException;
import com.chatapp.mainapp.Exceptions.UserException;
import com.chatapp.mainapp.Models.Message;
import com.chatapp.mainapp.Models.User;
import com.chatapp.mainapp.Requests.SendMRequest;
import com.chatapp.mainapp.Responses.ApiResponse;
import com.chatapp.mainapp.Services.MessageService;
import com.chatapp.mainapp.Services.UserService;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    private MessageService messageService;
    private UserService userService;

    private MessageController(MessageService messageService, UserService userService) {
        this.messageService=messageService;
        this.userService=userService;
    }

    @PostMapping("/create")
    public ResponseEntity<Message> sendMessageHandler(@RequestBody SendMRequest req, @RequestHeader("Authorization") String jwt) throws UserException, ChatException {
        User user = userService.findUserProfile(jwt);
        req.setUserId(user.getId());
        Message message = messageService.sendMessage(req);
        return new ResponseEntity<Message>(message, HttpStatus.OK);
    }

    // @GetMapping("/chat/{chatId}")
    // public ResponseEntity<List<Message>> getChatsMessageHandler(@PathVariable Integer chatId, @RequestHeader("Authorization") String jwt) throws UserException, ChatException {
    //     User user = userService.findUserProfile(jwt);
    //     List<Message> messages = messageService.getChatsMessages(chatId, user);
    //     return new ResponseEntity<List<Message>>(messages, HttpStatus.OK);
    // }

    @GetMapping("/chat/{chatId}")
    public ResponseEntity<List<Message>> getChatsMessageHandler(@PathVariable Integer chatId, @RequestHeader("Authorization") String jwt) throws UserException, ChatException {
        User user = userService.findUserProfile(jwt);
        List<Message> messages = messageService.getChatsMessages(chatId, user);
        System.out.println("Dispatching all messages");
        System.out.println(messages.toString());
        return new ResponseEntity<List<Message>>(messages, HttpStatus.OK);
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<ApiResponse> deleteMessageHandler(@PathVariable Integer messageId, @RequestHeader("Authorization") String jwt) throws UserException, MessageException {
        User user = userService.findUserProfile(jwt);
        messageService.deleteMessage(messageId, user);
        ApiResponse response = new ApiResponse("Message deleted successfully", true);
        return new ResponseEntity<ApiResponse>(response, HttpStatus.OK);
    }
}
